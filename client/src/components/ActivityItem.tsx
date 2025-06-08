import React from 'react';
import { GitHubActivity } from '../types';
import { formatDistanceToNow } from 'date-fns';
import {
    GitCommit,
    Star,
    GitFork,
    GitPullRequest,
    Plus,
    AlertCircle,
    ExternalLink
} from 'lucide-react';

interface ActivityItemProps {
    activity: GitHubActivity;
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'PushEvent':
            return <GitCommit className="w-4 h-4 text-blue-500" />;
        case 'WatchEvent':
            return <Star className="w-4 h-4 text-yellow-500" />;
        case 'ForkEvent':
            return <GitFork className="w-4 h-4 text-green-500" />;
        case 'PullRequestEvent':
            return <GitPullRequest className="w-4 h-4 text-purple-500" />;
        case 'CreateEvent':
            return <Plus className="w-4 h-4 text-green-500" />;
        case 'IssuesEvent':
            return <AlertCircle className="w-4 h-4 text-red-500" />;
        default:
            return <GitCommit className="w-4 h-4 text-gray-500" />;
    }
};

const getActivityColor = (type: string) => {
    switch (type) {
        case 'PushEvent':
            return 'border-l-blue-500 bg-blue-50';
        case 'WatchEvent':
            return 'border-l-yellow-500 bg-yellow-50';
        case 'ForkEvent':
            return 'border-l-green-500 bg-green-50';
        case 'PullRequestEvent':
            return 'border-l-purple-500 bg-purple-50';
        case 'CreateEvent':
            return 'border-l-green-500 bg-green-50';
        case 'IssuesEvent':
            return 'border-l-red-500 bg-red-50';
        default:
            return 'border-l-gray-500 bg-gray-50';
    }
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
    const timeAgo = formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true });

    return (
        <div className={`border-l-4 p-4 rounded-r-lg shadow-sm ${getActivityColor(activity.type)}`}>
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                        </p>
                        <span className="text-xs text-gray-500">{timeAgo}</span>
                    </div>

                    <div className="mt-1 flex items-center space-x-2">
                        <a
                            href={`https://github.com/${activity.repo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                            <span>{activity.repo}</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    {/* Additional details based on activity type */}
                    {activity.commits && activity.commits.length > 0 && (
                        <div className="mt-2 space-y-1">
                            {activity.commits.map((commit, index) => (
                                <div key={index} className="text-xs text-gray-600 bg-white p-2 rounded border">
                                    <span className="font-mono text-blue-600">{commit.sha}</span>
                                    <span className="ml-2">{commit.message}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activity.prTitle && (
                        <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border">
                            <span className="font-medium">PR #{activity.prNumber}:</span> {activity.prTitle}
                        </div>
                    )}

                    {activity.issueTitle && (
                        <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border">
                            <span className="font-medium">Issue #{activity.issueNumber}:</span> {activity.issueTitle}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
