import React, { useEffect, useState, useMemo, useCallback } from 'react';
import databaseService from '../Appwrite/DB';
import PreviewCard from './PreviewCard';
import { useSelector } from 'react-redux';

// Custom hook to handle posts fetching and caching
function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const postsData = await databaseService.getAllposts();
      setPosts(postsData || []);
      localStorage.setItem('posts', JSON.stringify(postsData || [])); // Cache in localStorage
    } catch (error) {
      console.error(`Could not retrieve all posts: ${error}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load cached posts on the initial render and call fetchPosts for the latest data
  useEffect(() => {
    const cachedPosts = JSON.parse(localStorage.getItem('posts'));
    if (cachedPosts) {
      setPosts(cachedPosts);
      setLoading(false);
    }
    fetchPosts(); // Fetch latest posts and update state
  }, [fetchPosts]);

  // Memoize the posts data to avoid re-computing if posts haven't changed
  const memoizedPosts = useMemo(() => posts, [posts]);

  return { posts: memoizedPosts, loading };
}

function Home() {
  const { posts, loading } = usePosts();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const renderContent = () => {
    if (!isAuthenticated) {
      return (
        <div className="w-screen flex justify-center">
          <h1 className="text-center text-white dark:text-gray-300 w-4/6 py-10 text-5xl bg-blue-400 dark:bg-gray-600 shadow-2xl rounded-3xl font-bold mt-10">
            Please Login To See Others' Posts
          </h1>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="w-screen flex justify-center">
          <h2 className="text-center text-gray-700 dark:text-gray-300 py-10 text-3xl">
            Loading posts...
          </h2>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="w-screen flex justify-center">
          <h2 className="text-center text-gray-700 dark:text-gray-300 py-10 text-3xl">
            No posts available.
          </h2>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-5">
        {posts.map((post, index) => (
          <div key={post.$id} className="max-w-[22vw]">
            <PreviewCard {...post} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="w-screen overflow-x-hidden overflow-y-scroll scroll bg-blue-600 dark:bg-gray-700 flex justify-center min-h-screen">
      <div className=" w-full mt-10 p-4 flex justify-evenly ">
        {renderContent()}
      </div>
    </main>
  );
}

export default Home;
