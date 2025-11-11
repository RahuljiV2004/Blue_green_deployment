pipeline {
    agent any

    environment {
        // Docker image name on Docker Hub
        DOCKER_IMAGE = "rahulji2004/bluegreen-app"

        // Ports for each environment
        BLUE_PORT = "8082"
        GREEN_PORT = "8081"
    }

    stages {

        /* --------------------------- Stage 1 --------------------------- */
        stage('📦 Checkout Source Code') {
            steps {
                echo "🔹 Fetching source code from GitHub..."
                git branch: 'main',
                    url: 'https://github.com/RahuljiV2004/Blue_green_deployment.git',
                    credentialsId: 'github-token'
            }
        }

        /* --------------------------- Stage 2 --------------------------- */
        stage('🐳 Build Docker Image') {
            steps {
                echo "🔹 Building Docker image from current code..."
                sh '''
                    echo "Building image: $DOCKER_IMAGE:${BUILD_NUMBER}"
                    docker build -t $DOCKER_IMAGE:${BUILD_NUMBER} .
                '''
            }
        }

        /* --------------------------- Stage 3 --------------------------- */
        stage('☁️ Push to Docker Hub') {
            steps {
                echo "🔹 Logging in to Docker Hub and pushing image..."
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DOCKERHUB_PASS')]) {
                    sh '''
                        echo "$DOCKERHUB_PASS" | docker login -u rahulji2004 --password-stdin
                        docker push $DOCKER_IMAGE:${BUILD_NUMBER}
                    '''
                }
            }
        }

        /* --------------------------- Stage 4 --------------------------- */
        stage('🟩 Deploy to Green Environment') {
            steps {
                echo "🔹 Deploying NEW version to GREEN environment on port $GREEN_PORT..."
                sh '''
                    docker stop green || true
                    docker rm green || true
                    docker run -d -p $GREEN_PORT:3000 --name green $DOCKER_IMAGE:${BUILD_NUMBER}
                '''
            }
        }

        /* --------------------------- Stage 5 --------------------------- */
       stage('Health Check') {
    steps {
        script {
            echo "⏳ Waiting for Green container to start..."
            sleep 5  // wait 5 seconds for Node to be ready
            def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:$GREEN_PORT", returnStdout: true).trim()
            if (response != '200') {
                error("❌ Green environment failed health check! Got HTTP $response")
            } else {
                echo "✅ Green environment is healthy and responding."
            }
        }
    }
}



        /* --------------------------- Stage 6 --------------------------- */
        stage('🔁 Switch Traffic to Green') {
            steps {
                echo "🔹 Switching live traffic to GREEN environment..."
                sh '''
                    echo "Stopping BLUE container (old version)..."
                    docker stop blue || true
                    docker rm blue || true

                    echo "Starting BLUE container using the new image..."
                    docker run -d -p $BLUE_PORT:3000 --name blue $DOCKER_IMAGE:${BUILD_NUMBER}
                '''
                echo "✅ Traffic successfully switched to the new version!"
            }
        }

        /* --------------------------- Stage 7 --------------------------- */
        stage('🧹 Cleanup Old Containers') {
            steps {
                echo "🔹 Cleaning up unused containers and images..."
                sh 'docker system prune -f'
                echo "✅ Cleanup completed."
            }
        }
    }

    /* ---------------------- Optional Notifications --------------------- */
    post {
        success {
            echo "🎉 Deployment Successful! Blue environment is now serving version ${BUILD_NUMBER}."
        }
        failure {
            echo "⚠️ Deployment Failed! Check Jenkins logs for more details."
        }
    }
}
