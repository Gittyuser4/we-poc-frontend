pipeline {

    agent any

    environment {
         DOCKER_IMAGE = "${DOCKER_NAMESPACE}/${JOB_BASE_NAME}"
         IMAGE_TAG = "${BUILD_NUMBER}"

       // SONARQUBE_SERVER = "SonarQube"
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
                    image 'node:20'
                    args '-u root'
                }
            }
            steps {
                sh '''
                    npm install
                    npm run build
                '''
            }
        }

        stage('Run Playwright Tests') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.58.2-jammy'
                    args '-u root'
                }
            }
            steps {
                sh '''
                    npm ci
                    npx playwright test
                '''
            }
}

        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv('SonarQube') {
                        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                            sh """
                                ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=we-poc-ui \
                                -Dsonar.sources=. \
                                -Dsonar.python.version=3.10 \
                                -Dsonar.login=$SONAR_TOKEN
                            """
                        }
                    }
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
                $DOCKER_IMAGE:$BUILD_NUMBER
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
                echo "Pulling latest image..."
                docker pull $DOCKER_IMAGE:latest

                echo "Changing to project root..."
                cd /home/jenkins/workspace/we-poc-ui

                docker-compose down || true
                docker-compose up -d
                '''
            }
        }
    }
}