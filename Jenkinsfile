pipeline {

    agent any

    environment {
        DOCKER_IMAGE = "prabhalasubbu99/we-poc-frontend"
        SONARQUBE_SERVER = "SonarQube"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build (Node Docker)') {
            agent {
                docker {
                    image 'node:18'
                    args '-u root'
                }
            }
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                    docker run --rm \
                    --network devops-stack_default \
                    -v $(pwd):/usr/src \
                    sonarsource/sonar-scanner-cli:latest \
                    sonar-scanner \
                    -Dsonar.projectKey=frontend \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=$SONAR_HOST_URL \
                    -Dsonar.login=$SONAR_AUTH_TOKEN
                    '''
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:$BUILD_NUMBER .'
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                docker run --rm \
                --network devops-stack_default \
                -v /var/run/docker.sock:/var/run/docker.sock \
                aquasec/trivy:latest image \
                prabhalasubbu99/we-poc-frontend:$BUILD_NUMBER
                '''
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {
                    sh '''
                    echo $PASSWORD | docker login -u $USERNAME --password-stdin
                    docker push $DOCKER_IMAGE:$BUILD_NUMBER
                    docker tag $DOCKER_IMAGE:$BUILD_NUMBER $DOCKER_IMAGE:latest
                    docker push $DOCKER_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                echo "Stopping existing container..."
                docker stop we-poc-frontend || true
                docker rm we-poc-frontend || true

                echo "Starting new container on port 3001..."
                docker run -d \
                --name we-poc-frontend \
                -p 3001:5173 \
                prabhalasubbu99/we-poc-frontend:latest
                '''
            }
        }
    }
}
