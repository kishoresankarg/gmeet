pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKER_HUB_USER = "kishoresankarg"
        KUBECONFIG = "/root/.kube/config"
    }

    stages {

        stage('Clone') {
            steps {
                checkout scm
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                sh '''
                docker compose down -v --remove-orphans || true
                docker rm -f meeting_notes_backend meeting_notes_frontend || true
                docker network prune -f || true
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Run Containers') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Test Backend') {
            steps {
                sh '''
                sleep 10
                docker run --rm --network meeting-notes-pipeline_default curlimages/curl \
                curl --retry 5 --retry-delay 5 http://meeting_notes_backend:8000/health
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh '''
                docker tag meeting-notes-pipeline-backend $DOCKER_HUB_USER/gmeet-backend:latest
                docker tag meeting-notes-pipeline-frontend $DOCKER_HUB_USER/gmeet-frontend:latest

                docker push $DOCKER_HUB_USER/gmeet-backend:latest
                docker push $DOCKER_HUB_USER/gmeet-frontend:latest
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                export KUBECONFIG=/root/.kube/config

                kubectl apply -f k8s/

                kubectl rollout restart deployment backend || true
                kubectl rollout restart deployment frontend || true
                '''
            }
        }
    }

    post {
        always {
            sh 'docker compose down -v || true'
        }

        success {
            echo "Pipeline SUCCESS 🚀"
        }

        failure {
            echo "Pipeline FAILED ❌"
        }
    }
}