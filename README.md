# GitHub Activity Tracker

A web application that tracks and visualizes GitHub user activity with a complete CI/CD pipeline.

![CI/CD Pipeline](images/CICD.svg)

## DevOps Overview

This project implements a complete DevOps pipeline:

- **Jenkins CI/CD Pipeline** hosted on DigitalOcean
- **GitHub Webhooks** for automatic pipeline triggers
- **Jenkins Shared Library** for reusable pipeline components
- **Docker Containerization** for consistent deployments
- **Automated Deployment** to AWS EC2

## CI/CD Pipeline

1. **Source Control**: GitHub repository with webhook integration
2. **Build & Test**: Jenkins pipeline automatically builds and tests code on push
3. **Containerization**: Builds Docker images for client and server components
4. **Registry**: Pushes images to DockerHub
5. **Deployment**: Pulls images and deploys to AWS EC2 using docker-compose

## Infrastructure

- **Jenkins Server**: DigitalOcean droplet running Jenkins
- **Production**: AWS EC2 instance running the containerized application
- **Container Registry**: DockerHub for image storage

## Jenkins Configuration

The pipeline leverages a [shared library](https://gitlab.com/AbdelrahmanElshahat/jenkins-shared-library.git) for standardized stages:

- Checkout code
- Install dependencies
- Run tests
- Build Docker images
- Push to registry
- Deploy to production

Webhooks trigger the pipeline on every push to the repository.

## Docker Containerization

The application is containerized into two services:

- **Client**: Frontend container
- **Server**: Backend API container

Docker Compose orchestrates the containers and manages networking.

## Deployment Process

Deployment is fully automated:

1. Jenkins triggers deployment script via SSH
2. Server pulls latest images from DockerHub
3. Docker Compose starts the application
4. Health checks verify successful deployment

## Monitoring & Health Checks

- Container health monitoring
- Application endpoint monitoring
- Automated recovery procedures

## Project Structure

```bash
├── client/                # Frontend code
│   └── Dockerfile         # Client Docker image definition
├── server/                # Backend code
│   └── Dockerfile         # Server Docker image definition
├── Jenkinsfile            # Jenkins pipeline definition
├── docker-compose.yml     # Docker compose configuration
├── images/                # Documentation images
│   └── CICD.svg           # CI/CD pipeline visualization
└── README.md              # Project documentation
```

## Troubleshooting

Common issues and solutions for the CI/CD pipeline:

- Pipeline failure resolution steps
- Container health recovery
- Deployment verification procedures

## License

This project is licensed under the MIT License.

---

Last Updated: June 16, 2025
