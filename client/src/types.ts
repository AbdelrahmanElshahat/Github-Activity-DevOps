export interface GitHubUser {
    login: string;
    name: string;
    avatar_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
}

export interface GitHubActivity {
    id: string;
    type: string;
    repo: string;
    createdAt: string;
    actor: string;
    avatarUrl: string;
    description: string;
    commitCount?: number;
    commits?: Array<{
        sha: string;
        message: string;
    }>;
    action?: string;
    prTitle?: string;
    prNumber?: number;
    issueTitle?: string;
    issueNumber?: number;
    refType?: string;
    forkName?: string;
}

export interface GitHubActivityResponse {
    user: GitHubUser;
    activities: GitHubActivity[];
    pagination: {
        page: number;
        per_page: number;
        hasMore: boolean;
    };
}

export interface ApiError {
    error: string;
    details?: string;
}
