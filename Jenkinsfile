pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "prabhalasubbu99/we-poc-frontend"
        SONARQUBE_SERVER = "SonarQube"
    }

    tools {
        nodejs "node18"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests - Playwright') {
            steps {
                sh 'npx playwright install'
                sh 'npx playwright test || true'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    sh '''
                    sonar-scanner \
                      -Dsonar.projectKey=frontend \
                      -Dsonar.sources=src \
                      -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
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
                sh 'trivy image $DOCKER_IMAGE:$BUILD_NUMBER'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                        usernameVariable: 'USERNAME',
                        passwordVariable: 'PASSWORD')]) {
                    sh '''
                    echo $PASSWORD | docker login -u $USERNAME --password-stdin
                    docker push $DOCKER_IMAGE:$BUILD_NUMBER
                    '''
                }
            }
        }

        stage('Sign Image with Cosign') {
            steps {
                sh 'cosign sign --key cosign.key $DOCKER_IMAGE:$BUILD_NUMBER'
            }
        }
    }
}
