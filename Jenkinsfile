pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKER_HUB_USER = "kishoresankarg"
    }

    stages {

        stage('Clone') {
            steps {
                checkout scm
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                echo "Cleaning old containers..."

                sh '''
                docker compose down -v --remove-orphans || true
                docker rm -f meeting_notes_backend meeting_notes_frontend || true
                docker network prune -f || true
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building Docker images..."

                sh '''
                docker compose build
                '''
            }
        }

        stage('Run Containers') {
            steps {
                echo "Starting containers..."

                sh '''
                docker compose up -d
                '''
            }
        }

        stage('Wait for Backend') {
            steps {
                echo "Waiting for backend..."

                sh '''
                sleep 10
                docker ps
                '''
            }
        }

        stage('Test Backend') {
            steps {
                echo "Testing backend..."

                sh '''
                docker run --rm \
                --network meeting-notes-pipeline_default \
                curlimages/curl \
                curl --retry 5 --retry-delay 5 http://meeting_notes_backend:8000/health
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "Pushing images to Docker Hub..."

                sh '''
                docker tag gmeet-backend $DOCKER_HUB_USER/gmeet-backend:latest
                docker tag gmeet-frontend $DOCKER_HUB_USER/gmeet-frontend:latest

                docker push $DOCKER_HUB_USER/gmeet-backend:latest
                docker push $DOCKER_HUB_USER/gmeet-frontend:latest
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Deploying to Kubernetes..."

                sh '''
                kubectl apply -f k8s/
                kubectl rollout restart deployment backend
                kubectl rollout restart deployment frontend
                '''
            }
        }
    }

    post {
        always {
            echo "Cleaning up containers..."

            sh '''
            docker compose down -v || true
            '''
        }

        success {
            echo "Pipeline SUCCESS 🚀"
        }

        failure {
            echo "Pipeline FAILED ❌"
        }
    }
}