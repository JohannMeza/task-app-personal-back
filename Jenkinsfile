pipeline {
  agent any
  environment {
    // 1. Detecta la rama del push (eliminando el prefijo "origin/" si existiera)
    BRANCH = "${env.BRANCH_NAME ?: (env.GIT_BRANCH ? env.GIT_BRANCH.replace('origin/', '') : 'develop')}"

    // 2. Traduce la rama al entorno (dev, stg, prd) para usar en Vault y Pulumi
    ENVIRONMENT = "${(BRANCH == 'develop' || BRANCH == 'dev') ? 'dev' : BRANCH == 'release' ? 'stg' : BRANCH == 'production' ? 'prd' : 'dev'}"
    NODE_ENV = "${ENVIRONMENT}"

    // Configuración general del registro
    REGISTRY_URL = '000000000000.dkr.ecr.us-east-1.localhost.localstack.cloud:4566'
    IMAGE_NAME = 'auth-service'
    IMAGE_TAG = 'latest'
    
    PULUMI_CONFIG_STRATEGY = 'overwrite'
    CONFIG_STRATEGY = 'overwrite'
    PULUMI_NON_INTERACTIVE = '1'
    NON_INTERACTIVE = '1'
    PULUMI_CONFIG_PASSPHRASE_FILE = 'passphrase.txt'
  }

  stages {
    stage('1. Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('2. Pulumi Deploy') {
      steps {
        echo "Calculando entorno y recuperando secretos de Vault para stack: ${ENVIRONMENT}..."
        
        powershell """
        \$env:PULUMI_CONFIG_PASSPHRASE_FILE = "passphrase.txt"
        cd infra
        
        # 1. Seleccionar o inicializar el stack de Pulumi de forma dinámica
        pulumilocal stack select ${ENVIRONMENT} 2>\$null
        if (\$LASTEXITCODE -ne 0) {
            pulumilocal stack init ${ENVIRONMENT}
        }
        
        # 2. Consultar los secretos del entorno específico en Vault
        \$vaultUrl = "http://localhost:8200/v1/task-app-personal/data/${ENVIRONMENT}/pulumi"
        \$vaultToken = "my-root-token"
        
        Write-Host "Consultando secretos en Vault: \$vaultUrl"
        try {
            \$response = Invoke-RestMethod -Uri \$vaultUrl -Headers @{ "X-Vault-Token" = \$vaultToken } -Method Get
            \$secrets = \$response.data.data
            Write-Host "Secretos obtenidos exitosamente de Vault."
        } catch {
            Write-Warning "No se pudo conectar a Vault: \$_ . Escribiendo con fallbacks locales..."
            \$secrets = @{}
        }
        
        # 3. Leer pulumi_params.txt e inyectar automáticamente en Pulumi sin mapeos fijos
        Get-Content "..\\config\\pulumi_params.txt" | ForEach-Object {
            \$param = \$_.Trim()
            if (\$param) {
                # Resolver clave en Vault probando automáticamente: exacto, sin namespace, MAYUSCULAS_SIN_NS y MAYUSCULAS_CON_NS
                \$keyNoNamespace = if (\$param.Contains(":")) { \$param.Split(":")[1] } else { \$param }
                \$keySnake = ([regex]::Replace(\$keyNoNamespace, '(?<=[a-z])([A-Z])', '_\$1')).ToUpper()
                \$fullKeySnake = ([regex]::Replace(\$param.Replace(":", "_"), '(?<=[a-z])([A-Z])', '_\$1')).ToUpper()
                
                \$val = \$secrets.\$param
                if (-not \$val) { \$val = \$secrets.\$keyNoNamespace }
                if (-not \$val) { \$val = \$secrets.\$keySnake }
                if (-not \$val) { \$val = \$secrets.\$fullKeySnake }
                
                if (\$val) {
                    # Si es un secreto sensible, lo encriptamos con --secret
                    \$isSecret = \$param.Contains("ClientId") -or \$param.Contains("AccessKey") -or \$param.Contains("Secret") -or \$param.Contains("Password")
                    if (\$isSecret) {
                        pulumilocal config set --secret \$param \$val
                        Write-Host "Inyectado secreto encriptado: \$param"
                    } else {
                        pulumilocal config set \$param \$val
                        Write-Host "Inyectada configuración: \$param"
                    }
                } else {
                    # Configuración por defecto (fallback) si falta algo en Vault
                    if (\$param -eq "secrets:vaultAddr") {
                        pulumilocal config set \$param "http://localhost.localstack.cloud:8200"
                        Write-Host "Inyectado fallback para: \$param"
                    }
                }
            }
        }
        
        # 5. Ejecutar instalación de Pulumi y desplegar los recursos
        npm install
        pulumilocal up --yes --skip-preview
        """
      }
    }

    stage('3. Build Docker Images') {
      steps {
        echo 'Construyendo las imágenes Docker...'
        bat "docker build -t auth-service:latest -f Dockerfile ."
        bat "docker build -t task-service:latest -f Dockerfile.task ."
      }
    }

    stage('4. Tag & Push to Localstack ECR') {
      steps {
        echo 'Asociando tags y subiendo las imágenes a Localstack ECR...'
        bat "docker tag auth-service:latest ${REGISTRY_URL}/auth-service:latest"
        bat "docker push ${REGISTRY_URL}/auth-service:latest"
        bat "docker tag task-service:latest ${REGISTRY_URL}/task-service:latest"
        bat "docker push ${REGISTRY_URL}/task-service:latest"
      }
    }

    stage('5. Restart ECS Services') {
      steps {
        echo 'Forzando el redespliegue en ECS para tomar la nueva versión de las imágenes...'
        bat "aws --endpoint-url=http://localhost:4566 ecs update-service --cluster task-app-personal-${ENVIRONMENT} --service auth-service --force-new-deployment"
        bat "aws --endpoint-url=http://localhost:4566 ecs update-service --cluster task-app-personal-${ENVIRONMENT} --service task-service --force-new-deployment"
      }
    }
  }
}