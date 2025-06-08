# GitHub Activity Web Application

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-blue.svg)](https://www.typescriptlang.org/)

A modern web application that displays GitHub user activity in real-time. Built with React, TypeScript, Node.js, and Tailwind CSS, this application provides a beautiful and intuitive interface to explore any GitHub user's recent activities.

![App Preview](./images/web-preview.png)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Overview

This web application is a modernized version of the original C++ CLI GitHub Activity tracker. It provides the same functionality through a beautiful web interface, allowing users to search for any GitHub username and view their recent activity in an organized, filtered, and paginated format.

## Features

### 🎯 Core Features

- **Real-time Activity Tracking**: View recent GitHub activities including:
  - 📝 **Push Events**: Commits pushed to repositories with commit details
  - ⭐ **Star Events**: Repositories starred by the user
  - 🍴 **Fork Events**: Repositories forked by the user
  - 🔀 **Pull Request Events**: Pull requests opened, closed, or merged
  - ➕ **Create Events**: New repositories, branches, or tags created
  - 🐛 **Issue Events**: Issues opened, closed, or commented on

### 🚀 Enhanced Features

- **User Profile Display**: Complete user information with avatar, bio, and statistics
- **Activity Filtering**: Filter activities by type (push, star, fork, etc.)
- **Infinite Scrolling**: Load more activities with pagination
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Search**: Instant search with username suggestions
- **Error Handling**: Comprehensive error handling with retry functionality
- **Loading States**: Smooth loading animations and states

### 🎨 UI/UX Features

- **Modern Design**: Clean, GitHub-inspired interface
- **Dark/Light Theme**: Automatic theme detection (expandable)
- **Activity Icons**: Visual icons for different activity types
- **Time Formatting**: Human-readable time formatting (e.g., "2 hours ago")
- **External Links**: Direct links to repositories and GitHub profiles
- **Commit Details**: Expandable commit information for push events

## Tech Stack

### Frontend

- **React 18+** with TypeScript
- **Tailwind CSS** for styling
- **React Query** for data fetching and caching
- **Lucide React** for icons
- **date-fns** for date formatting

### Backend

- **Node.js** with Express
- **Axios** for GitHub API requests
- **CORS** enabled for cross-origin requests
- **Helmet** for security headers
- **Compression** for response optimization

## Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (optional, for cloning)

### Quick Start

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/github-activity-web.git
   cd github-activity-web
   ```

2. **Install All Dependencies**

   ```bash
   npm run install:all
   ```

3. **Start Development Servers**

   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 3000) concurrently.

### Manual Installation

If you prefer to install and run servers separately:

1. **Install Root Dependencies**

   ```bash
   npm install
   ```

2. **Install Server Dependencies**

   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install Client Dependencies**

   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start Backend Server**

   ```bash
   npm run server:dev
   ```

5. **Start Frontend (in a new terminal)**

   ```bash
   npm run client:dev
   ```

## Usage

### Basic Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter a GitHub username in the search bar
3. Click search or press Enter
4. Explore the user's profile and recent activities
5. Use filters to view specific types of activities
6. Click "Load More" to see additional activities

### Example Usernames to Try

- `octocat` - GitHub's mascot account
- `torvalds` - Linux creator
- `gaearon` - React core team member
- `sindresorhus` - Popular open source contributor

### Configuration

#### Environment Variables

Create a `.env` file in the `server` directory:

```env
# GitHub Personal Access Token (optional, increases rate limits)
GITHUB_TOKEN=your_github_token_here

# Server port (default: 5000)
PORT=5000
```

#### GitHub Token Setup (Optional but Recommended)

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "GitHub Activity Web App"
4. No scopes are required for public activity
5. Copy the token and add it to your `.env` file

**Benefits of using a token:**

- Increased rate limits (5,000 requests/hour vs 60/hour)
- More reliable performance
- Access to private activity (if token has appropriate scopes)

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### Get User Activity

```http
GET /user/:username/activity?page=1&per_page=30
```

**Parameters:**

- `username` (required): GitHub username
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 30, max: 100)

**Response:**

```json
{
  "user": {
    "login": "octocat",
    "name": "The Octocat",
    "avatar_url": "https://github.com/images/error/octocat_happy.gif",
    "bio": "A great wild cat",
    "public_repos": 8,
    "followers": 4000,
    "following": 9,
    "created_at": "2011-01-25T18:44:36Z"
  },
  "activities": [...],
  "pagination": {
    "page": 1,
    "per_page": 30,
    "hasMore": true
  }
}
```

#### Get User Profile

```http
GET /user/:username
```

#### Health Check

```http
GET /health
```

## Project Structure

```
github-activity-web/
├── package.json              # Root package.json with scripts
├── README.md                 # This file
├── server/                   # Backend Node.js server
│   ├── package.json         # Server dependencies
│   ├── index.js             # Express server
│   └── .env.example         # Environment variables template
├── client/                   # Frontend React application
│   ├── package.json         # Client dependencies
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ActivityItem.tsx
│   │   │   ├── ActivityList.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── LoadingErrorStates.tsx
│   │   ├── api.ts           # API client functions
│   │   ├── types.ts         # TypeScript type definitions
│   │   ├── App.tsx          # Main App component
│   │   └── index.tsx        # Entry point
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── tsconfig.json        # TypeScript configuration
└── images/                   # Screenshots and assets
```

## Development Scripts

```bash
# Start both frontend and backend in development mode
npm run dev

# Start only the backend server
npm run server:dev

# Start only the frontend development server
npm run client:dev

# Build the frontend for production
npm run build

# Start the production server (backend only)
npm start

# Install all dependencies (root, server, and client)
npm run install:all
```

## Deployment

### Frontend (React App)

The frontend can be deployed to any static hosting service:

1. **Build the production bundle:**

   ```bash
   cd client
   npm run build
   ```

2. **Deploy the `build` folder to:**
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3
   - Any static hosting service

### Backend (Node.js Server)

The backend can be deployed to:

1. **Heroku:**

   ```bash
   # Add Procfile with: web: cd server && npm start
   git push heroku main
   ```

2. **Railway, Render, or DigitalOcean:**
   - Set build command: `cd server && npm install`
   - Set start command: `cd server && npm start`
   - Set environment variables

3. **VPS or Cloud Server:**

   ```bash
   # Using PM2
   npm install -g pm2
   cd server
   pm2 start index.js --name github-activity-api
   ```

## Contributing

We welcome contributions! Here's how you can help:

### Bug Reports

- Use the issue tracker to report bugs
- Include steps to reproduce the issue
- Provide error messages and screenshots

### Feature Requests

- Suggest new features through issues
- Explain the use case and expected behavior
- Consider contributing the implementation

### Development

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

### Coding Standards

- Use TypeScript for new code
- Follow the existing code style
- Add comments for complex logic
- Update documentation for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Original C++ version inspiration
- GitHub API for providing comprehensive activity data
- React and Node.js communities for excellent tooling
- Tailwind CSS for the beautiful design system

---

**Made with ❤️ and modern web technologies**
