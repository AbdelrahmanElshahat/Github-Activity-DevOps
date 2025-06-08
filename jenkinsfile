#!/usr/bin/env groovy
library 'identifier' : 'jenkins-shared-library@master','retriever': modernSCM(
    [
        $class: 'GitSCMSource',
        remote: 'https://gitlab.com/AbdelrahmanElshahat/jenkins-shared-library.git',
        credentials: 'github-credentials'
    ]
)
def gv
pipeline{
    agent any
    tools {
        nodejs 'my-nodejs'
    }

    stages{
        stage("incremental version"){
            steps{
                script{
                   incrementNodejsVersion() 
                }
            }
        }
            stage("push version"){
                steps{
                    script{
                        pushVersionToGit()
                    }
                }
            }
        
        stage("build"){
            steps{
                script{
                    buildNodejs()
                }
            }
        }
        stage("Build API Image"){
            steps{
                script{
                    def version = getVersionFromPackageJson()
                    echo "Building API Docker image with version: ${version}"
                    // Build the API Docker image
                    dir('server') {
                        buildImage 'elshahat20/myapp:github-activity-api:${version}'
                        // Also tag as latest for convenience
                        sh "docker tag elshahat20/myapp:github-activity-api:${version} elshahat20/myapp:github-activity-api:latest"
                    }
                }
            }
        }
        
        stage("Build Frontend Image"){
            steps{
                script{
                    def version = getVersionFromPackageJson()
                    echo "Building Frontend Docker image with version: ${version}"
                    // Build the Frontend Docker image
                    dir('client') {
                        buildImage 'elshahat20/myapp:github-activity-client:${version}'
                        // Also tag as latest for convenience
                        sh "docker tag elshahat20/myapp:github-activity-client:${version} elshahat20/myapp:github-activity-client:latest"
                    }
                }
            }
        }
        stage("docker login"){
            steps{
                script{
                    dockerLogin()
                }
            }
        }
        
        stage("Push Images to Registry"){
            steps{
                script{
                    def version = getVersionFromPackageJson()
                    echo "Pushing images to Docker Hub with version: ${version}"
                    
                    // Push API image
                    dockerPush 'elshahat20/myapp:github-activity-api:${version}'
                    

                    // Push Frontend image
                    dockerPush 'elshahat20/myapp:github-activity-client:${version}'
                    
                }
            }
        }


    }
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}