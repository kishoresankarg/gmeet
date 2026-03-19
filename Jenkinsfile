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
                // Build the project name for network discovery
                sh 'docker compose up -d'
                
                // Connect Jenkins to the compose network so it can resolve the backend container name
                // Note: 'gmeet_default' is the default network name based on the folder 'gmeet'
                sh 'docker network connect gmeet_default jenkins || true'
            }
        }

        stage('Test Backend') {
            steps {
                echo "Verifying backend health..."
                // Using the container name instead of localhost for container-to-container communication
                sh 'curl --retry 5 --retry-delay 5 http://meeting_notes_backend:8000/health'
            }
        }
    }

    post {
        always {
            echo "Cleaning up..."
           
        }
        success {
            echo "GitHub Hook Build Successful!"
        }
        failure {
            echo "Build Failed! Check the console output."
        }
    }
}
