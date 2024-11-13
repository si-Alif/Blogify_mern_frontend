import React, { useEffect, useState, useMemo, useCallback } from 'react';
import databaseService from '../Appwrite/DB';
import PreviewCard from './PreviewCard';
import { useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window'; // for virtualization

// Custom hook to handle posts fetching and caching
function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const cachedPosts = JSON.parse(localStorage.getItem('posts'));
      if (cachedPosts) {
        setPosts(cachedPosts);
        setLoading(false);
      } else {
        const postsData = await databaseService.getAllposts();
        setPosts(postsData || []);
        localStorage.setItem('posts', JSON.stringify(postsData || [])); // Cache in localStorage
      }
    } catch (error) {
      console.error(`Could not retrieve all posts in Home: ${error}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading };
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
      <List
        height={600}
        itemCount={posts.length}
        itemSize={200}
        width={'100%'}
      >
        {({ index, style }) => (
          <div style={style}>
            <PreviewCard {...posts[index]} />
          </div>
        )}
      </List>
    );
  };

  return (
    <main className="w-screen h-screen overflow-x-hidden bg-blue-600 dark:bg-gray-700 flex flex-col justify-start items-baseline">
      {renderContent()}
    </main>
  );
}

export default Home;
