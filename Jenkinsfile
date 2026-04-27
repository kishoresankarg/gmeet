pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKER_HUB_USER = "kishoresankarg"
        KUBECONFIG = "/var/jenkins_home/.kube/config"
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

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                    echo "$PASS" | docker login -u "$USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push') {
            steps {
                sh '''
                docker images

                docker tag meeting-notes-pipeline_backend $DOCKER_HUB_USER/gmeet-backend:latest || true
                docker tag meeting-notes-pipeline_frontend $DOCKER_HUB_USER/gmeet-frontend:latest || true

                docker push $DOCKER_HUB_USER/gmeet-backend:latest || true
                docker push $DOCKER_HUB_USER/gmeet-frontend:latest || true
                '''
            }
        }

        stage('Deploy K8s') {
            steps {
                sh '''
                export KUBECONFIG=/var/jenkins_home/.kube/config

                kubectl get nodes || true

                kubectl apply -f k8s/ || echo "k8s folder missing"

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