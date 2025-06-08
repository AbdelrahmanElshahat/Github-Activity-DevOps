import React from 'react';
import { GitHubUser } from '../types';
import { Calendar, Users, BookOpen, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserProfileProps {
    user: GitHubUser;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const joinedDate = formatDistanceToNow(new Date(user.created_at), { addSuffix: true });

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start space-x-4">
                <img
                    src={user.avatar_url}
                    alt={`${user.login}'s avatar`}
                    className="w-20 h-20 rounded-full border-2 border-gray-200"
                />

                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user.name || user.login}</h1>
                            <p className="text-gray-600">@{user.login}</p>
                        </div>

                        <a
                            href={`https://github.com/${user.login}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                            <span>View on GitHub</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    {user.bio && (
                        <p className="mt-2 text-gray-700">{user.bio}</p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{user.public_repos} repositories</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{user.followers} followers</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{user.following} following</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {joinedDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
