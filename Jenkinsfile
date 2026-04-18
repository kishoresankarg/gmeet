pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building images..."
                sh 'docker compose build'
            }
        }

        stage('Run Containers') {
            steps {
                echo "Cleaning old containers..."
                sh 'docker compose down || true'

                echo "Starting containers..."
                sh 'docker compose up -d'
            }
        }

        stage('Test Backend') {
            steps {
                echo "Testing backend..."

                sh '''
                docker run --rm \
                --network meeting-notes-pipeline_default \
                curlimages/curl \
                http://backend:8000/health
                '''
            }
        }
    }

    post {
        always {
            echo "Cleaning up..."
        }
        success {
            echo "Build Successful!"
        }
        failure {
            echo "Build Failed! Check logs."
        }
    }
}