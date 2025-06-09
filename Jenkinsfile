#!/usr/bin/env groovy
library 'identifier' : 'jenkins-shared-library@master','retriever': modernSCM(
    [
        $class: 'GitSCMSource',
        remote: 'https://gitlab.com/AbdelrahmanElshahat/jenkins-shared-library.git',
        credentials: 'gitlab-credentials'
    ]
)
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
        
        stage("build server and client"){
            steps{
                script{
                    dir('server'){
                    buildNodejs()
                    }
                    dir('client'){
                        buildNodejs()
                    }
                }
            }
        }
        stage("Build API Image"){
            steps{
                script{
                    def version = getVersionFromPackageJson()
                    echo "Raw version from function: '${version}'"
                    
        
                    dir('server') {
                        buildImage "elshahat20/my-app:github-activity-api${version}"
                    }
                }
            }
        }        
        stage("Build Frontend Image"){
            steps{
                script{
                    def version = getVersionFromPackageJson()
                    dir('client') {
                       buildImage "elshahat20/my-app:github-activity-client${version}"
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
                    echo "Raw version from function: '${version}'"
                    dockerPush "elshahat20/my-app:github-activity-api${version}"
                    dockerPush "elshahat20/my-app:github-activity-client${version}"
                }
            }
        }
        stage("Deploy"){
            steps{
                script{
                    def version = getVersionFromPackageJson()
                    def shellcmd = "bash ./server_cmd.sh ${version}"
                    sshagent(['ec2-server']) {
                        sh "scp server_cmd.sh ec2-user@13.48.127.224:/home/ec2-user"
                        sh "scp docker-compose.yml ec2-user@13.48.127.224:/home/ec2-user"
                        sh "ssh -o StrictHostKeyChecking=no ec2-user@13.48.127.224 '${shellcmd}"
                    }
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