pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                // Using 'checkout scm' is better for automatic builds triggered by GitHub
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building images using docker compose..."
                sh 'docker compose build'
            }
        }

        stage('Run Containers') {
            steps {
                echo "Starting containers..."
                sh 'docker compose up -d'
            }
        }

        stage('Test Backend') {
            steps {
                echo "Verifying backend health..."
                // Added --retry to ensure it waits for the container to actually start
                sh 'curl --retry 5 --retry-delay 5 http://localhost:8000/health'
            }
        }
    }

    post {
        always {
            echo "Cleaning up..."
            sh 'docker compose down'
            cleanWs()
        }
        success {
            echo "GitHub Hook Build Successful!"
        }
        failure {
            echo "Build Failed! Check the console output."
        }
    }
}
