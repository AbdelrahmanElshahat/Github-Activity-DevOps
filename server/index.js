const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

// GitHub API base URL
const GITHUB_API_BASE = 'https://api.github.com';

// Helper function to format activity data
const formatActivity = (events) => {
    return events.map(event => {
        const baseData = {
            id: event.id,
            type: event.type,
            repo: event.repo.name,
            createdAt: event.created_at,
            actor: event.actor.login,
            avatarUrl: event.actor.avatar_url
        };

        switch (event.type) {
            case 'PushEvent':
                return {
                    ...baseData,
                    description: `Pushed ${event.payload.commits.length} commit${event.payload.commits.length > 1 ? 's' : ''} to ${event.repo.name}`,
                    commitCount: event.payload.commits.length,
                    commits: event.payload.commits.slice(0, 3).map(commit => ({
                        sha: commit.sha.substring(0, 7),
                        message: commit.message
                    }))
                };

            case 'WatchEvent':
                return {
                    ...baseData,
                    description: `Starred ${event.repo.name}`,
                    action: 'starred'
                };

            case 'CreateEvent':
                const refType = event.payload.ref_type;
                return {
                    ...baseData,
                    description: `Created ${refType} ${event.payload.ref || ''} in ${event.repo.name}`,
                    refType: refType
                };

            case 'PullRequestEvent':
                const action = event.payload.action;
                return {
                    ...baseData,
                    description: `${action.charAt(0).toUpperCase() + action.slice(1)} pull request in ${event.repo.name}`,
                    action: action,
                    prTitle: event.payload.pull_request?.title,
                    prNumber: event.payload.pull_request?.number
                };

            case 'ForkEvent':
                return {
                    ...baseData,
                    description: `Forked ${event.repo.name}`,
                    forkName: event.payload.forkee?.full_name
                };

            case 'IssuesEvent':
                return {
                    ...baseData,
                    description: `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} issue in ${event.repo.name}`,
                    action: event.payload.action,
                    issueTitle: event.payload.issue?.title,
                    issueNumber: event.payload.issue?.number
                };

            default:
                return {
                    ...baseData,
                    description: `${event.type.replace('Event', '')} in ${event.repo.name}`
                };
        }
    });
};

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/user/:username/activity', async (req, res) => {
    try {
        const { username } = req.params;
        const { page = 1, per_page = 30 } = req.query;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // First, check if user exists
        const userResponse = await axios.get(`${GITHUB_API_BASE}/users/${username}`, {
            headers: {
                'User-Agent': 'GitHub-Activity-Web-App',
                ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` })
            }
        });

        // Get user activity
        const activityResponse = await axios.get(`${GITHUB_API_BASE}/users/${username}/events`, {
            headers: {
                'User-Agent': 'GitHub-Activity-Web-App',
                ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` })
            },
            params: {
                page,
                per_page
            }
        });

        const formattedActivity = formatActivity(activityResponse.data);

        res.json({
            user: {
                login: userResponse.data.login,
                name: userResponse.data.name,
                avatar_url: userResponse.data.avatar_url,
                bio: userResponse.data.bio,
                public_repos: userResponse.data.public_repos,
                followers: userResponse.data.followers,
                following: userResponse.data.following,
                created_at: userResponse.data.created_at
            },
            activities: formattedActivity,
            pagination: {
                page: parseInt(page),
                per_page: parseInt(per_page),
                hasMore: activityResponse.data.length === parseInt(per_page)
            }
        });

    } catch (error) {
        console.error('Error fetching GitHub activity:', error.message);

        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (error.response?.status === 403) {
            return res.status(429).json({
                error: 'GitHub API rate limit exceeded. Please try again later.'
            });
        }

        res.status(500).json({
            error: 'Failed to fetch user activity',
            details: error.message
        });
    }
});

app.get('/api/user/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const response = await axios.get(`${GITHUB_API_BASE}/users/${username}`, {
            headers: {
                'User-Agent': 'GitHub-Activity-Web-App',
                ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` })
            }
        });

        res.json(response.data);
    } catch (error) {
        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Serve React app for all non-API routes (for production)
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 GitHub Activity API ready at http://localhost:${PORT}/api`);
});

module.exports = app;
