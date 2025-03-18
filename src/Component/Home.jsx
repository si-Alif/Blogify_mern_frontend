import React, { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import databaseService from '../Appwrite/DB';
const PreviewCard = React.lazy(() => import('./PreviewCard'));
import { useSelector } from 'react-redux';
import axios from 'axios';

// Custom hook for fetching and caching posts
function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const postsData = await databaseService.getAllposts();
      if (postsData) {
        setPosts(postsData);
        localStorage.setItem('posts', JSON.stringify(postsData));
      }
    } catch (error) {
      console.error(`Error fetching posts: ${error}`);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    const cachedPosts = JSON.parse(localStorage.getItem('posts'));
    if (cachedPosts) {
      setPosts(cachedPosts);
      setLoading(false);
    }
    fetchPosts(); // Always fetch the latest posts
  }, [fetchPosts]);

  return { posts, loading };
}

function Home() {
  const { posts, loading } = usePosts();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const renderContent = useMemo(() => {
    if (!isAuthenticated) {
      return (
        <ContentMessage
          message="Please Login To See Others' Posts"
          bgColor="bg-blue-400 dark:bg-gray-600"
        />
      );
    }

    if (loading) {
      return <ContentMessage message="Loading posts..." />;
    }

    if (posts.length === 0) {
      return <ContentMessage message="No posts available." />;
    }

    return (
      <section
        className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4"
        aria-label="Posts Grid"
      >
        {posts.map((post) => (
          <div
            key={post.$id}
            className="max-w-[23vw] h-[55vh] p-4  bg-white dark:bg-gray-800 shadow-lg shadow-gray-500 dark:shadow-blue-600 rounded-lg transition hover:shadow-lg"
          >
            <Suspense fallback={<PlaceholderCard />}>
              <PreviewCard {...post} />
            </Suspense>
          </div>
        ))}
      </section>
    );
  }, [isAuthenticated, loading, posts]);

  return (
    <main className="w-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center min-h-screen">
      <header className="w-full py-5 bg-blue-600 dark:bg-gray-800 text-white text-center shadow-lg shadow-blue-700">
        <h1 className="text-2xl font-bold">Welcome !!!</h1>
      </header>
      <div className="w-full flex justify-center py-10">{renderContent}</div>
    </main>
  );
}

// Component for reusable messages
const ContentMessage = React.memo(({ message, bgColor = "bg-gray-300" }) => (
  <div className="w-full flex justify-center items-center min-h-[50vh]">
    <h2
      className={`text-center text-gray-800 dark:text-gray-200 py-6 px-8 rounded-lg shadow-lg shadow-blue-600 text-lg font-medium ${bgColor}`}
    >
      {message}
    </h2>
  </div>
));

// Placeholder for lazy-loaded PreviewCard
const PlaceholderCard = () => (
  <div className="h-32 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg" />
);

export default Home;
