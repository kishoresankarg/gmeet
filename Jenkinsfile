pipeline {
    agent any

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
                docker-compose down -v || true
                docker rm -f meeting_notes_backend meeting_notes_frontend || true
                docker network prune -f || true
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building Docker images..."
                sh 'docker-compose build'
            }
        }

        stage('Run Containers') {
            steps {
                echo "Starting containers..."
                sh 'docker-compose up -d'
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
    }

    post {
        always {
            echo "Cleanup after build..."

            sh '''
            docker-compose down -v || true
            '''
        }

        success {
            echo "Build Successful!"
        }

        failure {
            echo "Build Failed! Check logs."
        }
    }
}
