pipeline {
    agent any

    environment {
        // Update these with your actual registry details
        REGISTRY_URL = "your-registry-url" 
        REGISTRY_CREDENTIALS_ID = "docker-registry-credentials"
        
        DOCKER_IMAGE_BACKEND = "${REGISTRY_URL}/meetpulse-backend"
        DOCKER_IMAGE_FRONTEND = "${REGISTRY_URL}/meetpulse-frontend"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Registry Login') {
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY_URL}", REGISTRY_CREDENTIALS_ID) {
                        echo "Successfully authenticated with registry ${REGISTRY_URL}"
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    script {
                        docker.build("${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}")
                    }
                }
            }
        }

        stage('Push Backend') {
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY_URL}", REGISTRY_CREDENTIALS_ID) {
                        docker.image("${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}").push("latest")
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        docker.build("${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}")
                    }
                }
            }
        }

        stage('Push Frontend') {
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY_URL}", REGISTRY_CREDENTIALS_ID) {
                        docker.image("${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}").push("latest")
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "Deploying application with Docker Compose..."
                    // In a real production scenario, you would pull the images from the registry
                    // and use a production-specific docker-compose.yml or swarm/k8s.
                    sh "docker-compose up -d"
                    
                    echo "Waiting for services to be healthy..."
                    sh "docker-compose ps --format '{{.Service}} {{.Health}}' | grep -v 'healthy' && exit 1 || exit 0"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "Pipeline completed successfully! Images pushed to ${REGISTRY_URL}"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
