pipeline {
  agent any
  environment {
    // En produccion aqui iria tu URI de AWS ECR real
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
        // Descarga el codigo fuente del repositorio
        checkout scm
      }
    }

    stage('2. Pulumi Deploy') {
      steps {
        echo 'Desplegando la infraestructura localmente con Pulumi (para crear repositorios ECR)...'
        // Instala dependencias del SDK de Pulumi con npm y ejecuta el deploy
        bat "cd infra && npm install && pulumi install && pulumi stack select dev && pulumilocal up --yes --skip-preview"
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
  }
}