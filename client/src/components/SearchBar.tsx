import React, { useState } from 'react';
import { Search, Github } from 'lucide-react';

interface SearchBarProps {
    onSearch: (username: string) => void;
    isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onSearch(username.trim());
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Github className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter GitHub username..."
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <button
                            type="submit"
                            disabled={isLoading || !username.trim()}
                            className="inline-flex items-center px-4 py-2 m-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-2 text-center text-sm text-gray-600">
                Try searching for popular users like:
                <button
                    onClick={() => onSearch('octocat')}
                    className="ml-1 text-blue-600 hover:text-blue-800 underline"
                >
                    octocat
                </button>
                ,
                <button
                    onClick={() => onSearch('torvalds')}
                    className="ml-1 text-blue-600 hover:text-blue-800 underline"
                >
                    torvalds
                </button>
                ,
                <button
                    onClick={() => onSearch('gaearon')}
                    className="ml-1 text-blue-600 hover:text-blue-800 underline"
                >
                    gaearon
                </button>
            </div>
        </div>
    );
};
