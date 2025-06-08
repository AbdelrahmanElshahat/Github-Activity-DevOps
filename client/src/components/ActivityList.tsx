import React from 'react';
import { GitHubActivity } from '../types';
import { ActivityItem } from './ActivityItem';
import { ChevronDown, Filter } from 'lucide-react';

interface ActivityListProps {
    activities: GitHubActivity[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({
    activities,
    isLoading,
    hasMore,
    onLoadMore
}) => {
    const [filter, setFilter] = React.useState<string>('all');

    const filteredActivities = activities.filter(activity => {
        if (filter === 'all') return true;
        return activity.type === filter;
    });

    const activityTypes = Array.from(new Set(activities.map(a => a.type)));

    if (activities.length === 0 && !isLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No recent activity found</p>
                <p className="text-gray-400 text-sm mt-2">This user hasn't been active recently or their activity is private</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            {activityTypes.length > 1 && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Filter by activity:</span>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Activities</option>
                            {activityTypes.map(type => (
                                <option key={type} value={type}>
                                    {type.replace('Event', '')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Activity Items */}
            <div className="space-y-4">
                {filteredActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="text-center">
                    <button
                        onClick={onLoadMore}
                        disabled={isLoading}
                        className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                <span>Load More</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {filteredActivities.length === 0 && filter !== 'all' && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No {filter.replace('Event', '')} activities found</p>
                    <button
                        onClick={() => setFilter('all')}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                        Show all activities
                    </button>
                </div>
            )}
        </div>
    );
};
