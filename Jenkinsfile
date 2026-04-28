pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {

        stage('Clone') {
            steps {
                checkout scm
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                docker compose down -v --remove-orphans || true
                docker rm -f meeting_notes_backend meeting_notes_frontend || true
                docker network prune -f || true
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Run') {
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
    }

    post {
        

        success {
            echo "Pipeline SUCCESS 🚀"
        }

        failure {
            echo "Pipeline FALED ❌"
        }
    }
}