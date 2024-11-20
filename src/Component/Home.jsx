import React, { useEffect, useState, useMemo, useCallback } from 'react'; 
import databaseService from '../Appwrite/DB';
const PreviewCard = React.lazy(() => import('./PreviewCard'));

import { useSelector } from 'react-redux';

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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {posts.map((post) => (
          <div key={post.$id} className="max-w-[22vw]">
            <PreviewCard {...post} />
          </div>
        ))}
      </div>
    );
  }, [isAuthenticated, loading, posts]);

  return (
    <main className="w-screen overflow-x-hidden overflow-y-scroll bg-blue-600 dark:bg-gray-700 flex justify-center min-h-screen">
      <div className="w-full mt-10 p-4 flex justify-evenly">{renderContent}</div>
    </main>
  );
}

// Component for reusable messages
const ContentMessage = React.memo(({ message, bgColor = "bg-gray-300" }) => (
  <div className="w-screen flex justify-center">
    <h2
      className={`text-center text-gray-700 dark:text-gray-300 py-10 text-3xl ${bgColor}`}
    >
      {message}
    </h2>
  </div>
));

export default Home;
