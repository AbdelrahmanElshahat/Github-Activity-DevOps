import axios from 'axios';
import { GitHubActivityResponse, GitHubUser } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

export const githubApi = {
    getUserActivity: async (username: string, page = 1, per_page = 30): Promise<GitHubActivityResponse> => {
        const response = await api.get(`/user/${username}/activity`, {
            params: { page, per_page }
        });
        return response.data;
    },

    getUser: async (username: string): Promise<GitHubUser> => {
        const response = await api.get(`/user/${username}`);
        return response.data;
    },

    checkHealth: async () => {
        const response = await api.get('/health');
        return response.data;
    }
};

export default api;
