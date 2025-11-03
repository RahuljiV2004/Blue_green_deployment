pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "rahulji2004/bluegreen-app"
        BLUE_PORT = "8080"
        GREEN_PORT = "8081"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/RahuljiV2004/bluegreen-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:${BUILD_NUMBER} .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DOCKERHUB_PASS')]) {
                    sh '''
                        echo "$DOCKERHUB_PASS" | docker login -u rahulji2004 --password-stdin
                        docker push $DOCKER_IMAGE:${BUILD_NUMBER}
                    '''
                }
            }
        }

        stage('Deploy to Green Environment') {
            steps {
                sh '''
                    docker stop green || true
                    docker rm green || true
                    docker run -d -p $GREEN_PORT:3000 --name green $DOCKER_IMAGE:${BUILD_NUMBER}
                '''
            }
        }

        stage('Health Check') {
            steps {
                script {
                    def status = sh(script: "curl -s http://localhost:$GREEN_PORT | grep 'Hello' ", returnStatus: true)
                    if (status != 0) {
                        error("Green environment failed health check!")
                    }
                }
            }
        }

        stage('Switch Traffic to Green') {
            steps {
                sh '''
                    docker stop blue || true
                    docker rm blue || true
                    docker run -d -p $BLUE_PORT:3000 --name blue $DOCKER_IMAGE:${BUILD_NUMBER}
                '''
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                sh 'docker system prune -f'
            }
        }
    }
}
