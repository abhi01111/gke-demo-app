pipeline {
    agent any

    environment {
        PROJECT_ID = "your-gcp-project-id"
        REGION = "asia-south1"
        REPO = "gke-demo-repo"

        GATEWAY_IMAGE = "gateway"
        USER_IMAGE = "user"
        PRODUCT_IMAGE = "product"

        TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/abhi01111/gke-demo-app.git'
            }
        }

        stage('Authenticate to GCP') {
            steps {
                withCredentials([file(credentialsId: 'gcp-key', variable: 'GCP_KEY')]) {
                    sh '''
                    gcloud auth activate-service-account --key-file=$GCP_KEY
                    gcloud config set project $PROJECT_ID
                    gcloud auth configure-docker $REGION-docker.pkg.dev
                    '''
                }
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                docker build -f docker/gateway.Dockerfile -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$GATEWAY_IMAGE:$TAG ./gateway
                docker build -f docker/user.Dockerfile -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$USER_IMAGE:$TAG ./user-service
                docker build -f docker/product.Dockerfile -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$PRODUCT_IMAGE:$TAG ./product-service
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$GATEWAY_IMAGE:$TAG
                docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$USER_IMAGE:$TAG
                docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$PRODUCT_IMAGE:$TAG
                '''
            }
        }

        stage('Connect to GKE') {
            steps {
                sh '''
                gcloud container clusters get-credentials my-cluster --zone asia-south1-a
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f k8s/
                '''
            }
        }

        stage('Update Images (Rolling Update)') {
            steps {
                sh '''
                kubectl set image deployment/gateway gateway=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$GATEWAY_IMAGE:$TAG
                kubectl set image deployment/user user=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$USER_IMAGE:$TAG
                kubectl set image deployment/product product=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$PRODUCT_IMAGE:$TAG
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                kubectl get pods
                kubectl get services
                '''
            }
        }
    }

    post {
        success {
            echo "GKE Deployment Successful!"
        }
        failure {
            echo "Deployment Failed!"
        }
    }
}