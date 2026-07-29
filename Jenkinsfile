pipeline {
  agent any
  environment {
    // En produccion aqui iria tu URI de AWS ECR real
    REGISTRY_URL = 'localhost:4566'
    IMAGE_NAME = 'auth-service'
    IMAGE_TAG = 'latest'
    PULUMI_CONFIG_STRATEGY = 'override'
    CONFIG_STRATEGY = 'override'
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
        // Selecciona el stack dev usando el comando nativo de pulumi para evitar prompts interactivos
        bat "cd infra && pulumi stack select dev && pulumilocal up --yes --skip-preview"
      }
    }

    stage('3. Build Docker Image') {
      steps {
        echo 'Construyendo la imagen Docker desde la raiz del proyecto...'
        bat "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
      }
    }

    stage('4. Tag & Push to Localstack ECR') {
      steps {
        echo 'Asociando tag y subiendo la imagen a Localstack ECR...'
        // Taggear la imagen
        bat "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}"
        // Subir al registro (En Localstack no hace falta hacer "docker login")
        bat "docker push ${REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}"
      }
    }
  }
}