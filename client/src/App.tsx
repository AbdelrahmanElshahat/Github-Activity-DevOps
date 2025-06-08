import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { githubApi } from './api';
import { SearchBar } from './components/SearchBar';
import { UserProfile } from './components/UserProfile';
import { ActivityList } from './components/ActivityList';
import { ErrorState, LoadingState } from './components/LoadingErrorStates';
import { GitHubActivity } from './types';
import { Github } from 'lucide-react';

const queryClient = new QueryClient();

function GitHubActivityApp() {
  const [username, setUsername] = useState<string>('');
  const [page, setPage] = useState(1);
  const [allActivities, setAllActivities] = useState<GitHubActivity[]>([]);

  const {
    data: activityData,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['github-activity', username, page],
    queryFn: () => githubApi.getUserActivity(username, page),
    enabled: !!username,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  React.useEffect(() => {
    if (activityData?.activities) {
      if (page === 1) {
        setAllActivities(activityData.activities);
      } else {
        setAllActivities(prev => [...prev, ...activityData.activities]);
      }
    }
  }, [activityData, page]);

  const handleSearch = (newUsername: string) => {
    setUsername(newUsername);
    setPage(1);
    setAllActivities([]);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Github className="w-8 h-8 text-gray-900" />
              <h1 className="text-2xl font-bold text-gray-900">GitHub Activity Tracker</h1>
            </div>
            <div className="text-sm text-gray-500">
              Track any GitHub user's recent activity
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading && page === 1} />
        </div>

        {/* Results Section */}
        {username && (
          <div className="space-y-6">
            {isLoading && page === 1 ? (
              <LoadingState message={`Loading ${username}'s activity...`} />
            ) : error ? (
              <ErrorState
                error={error instanceof Error ? error.message : 'Failed to fetch user activity'}
                onRetry={handleRetry}
              />
            ) : activityData ? (
              <>
                <UserProfile user={activityData.user} />
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                  <ActivityList
                    activities={allActivities}
                    isLoading={isFetching && page > 1}
                    hasMore={activityData.pagination.hasMore}
                    onLoadMore={handleLoadMore}
                  />
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* Welcome State */}
        {!username && (
          <div className="text-center py-16">
            <Github className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome to GitHub Activity Tracker
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter a GitHub username above to explore their recent activity including commits,
              stars, forks, pull requests, and more.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>Built with React, TypeScript, and Tailwind CSS</p>
            <p className="mt-1">Powered by GitHub API</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GitHubActivityApp />
    </QueryClientProvider>
  );
}

export default App;
