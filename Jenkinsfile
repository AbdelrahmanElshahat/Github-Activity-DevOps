#!/usr/bin/env groovy
library 'identifier' : 'jenkins-shared-library@master','retriever': modernSCM(
    [
        $class: 'GitSCMSource',
        remote: 'https://gitlab.com/AbdelrahmanElshahat/jenkins-shared-library.git',
        credentials: 'gitlab-credentials'
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
                    echo "Raw version from function: '${version}'"
                    
                    // Clean the version string and validate it
                    def cleanVersion = version?.trim()
                    if (!cleanVersion || cleanVersion.isEmpty()) {
                        error "Version is empty or null"
                    }
                    
                    echo "Clean version: '${cleanVersion}'"
                    echo "Building API Docker image with version: ${cleanVersion}"
                    
                    // Build the API Docker image
                    dir('server') {
                        def imageName = "elshahat20/myapp-github-activity-api:${cleanVersion}"
                        echo "Building image: ${imageName}"
                        sh "docker build -t '${imageName}' ."
                        // Also tag as latest for convenience
                        sh "docker tag '${imageName}' elshahat20/myapp-github-activity-api:latest"
                    }
                }
            }
        }
        
        stage("Build Frontend Image"){
            steps{
                script{
                    def version = getVersionFromPackageJson()
                    def cleanVersion = version?.trim()
                    if (!cleanVersion || cleanVersion.isEmpty()) {
                        error "Version is empty or null"
                    }
                    
                    echo "Building Frontend Docker image with version: ${cleanVersion}"
                    // Build the Frontend Docker image
                    dir('client') {
                        def imageName = "elshahat20/myapp-github-activity-client:${cleanVersion}"
                        echo "Building image: ${imageName}"
                        sh "docker build -t '${imageName}' ."
                        // Also tag as latest for convenience
                        sh "docker tag '${imageName}' elshahat20/myapp-github-activity-client:latest"
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
                    def cleanVersion = version?.trim()
                    echo "Pushing images to Docker Hub with version: ${cleanVersion}"
                    
                    // Push API image
                    def apiImageName = "elshahat20/myapp-github-activity-api:${cleanVersion}"
                    sh "docker push '${apiImageName}'"
                    sh "docker push elshahat20/myapp-github-activity-api:latest"
                    
                    // Push Frontend image
                    def clientImageName = "elshahat20/myapp-github-activity-client:${cleanVersion}"
                    sh "docker push '${clientImageName}'"
                    sh "docker push elshahat20/myapp-github-activity-client:latest"
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