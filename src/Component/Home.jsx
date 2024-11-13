import React, { useEffect, useState } from 'react';
import databaseService from '../Appwrite/DB';
import PreviewCard from './PreviewCard';
import { useSelector } from 'react-redux';

function Home() {
  const [posts, setPosts] = useState([]);

  const userState = useSelector(state=>state.auth.isAuthenticated)

  useEffect(() => {
    databaseService.getAllposts()
      .then((Posts) => {
        if (Posts) setPosts(Posts);
      })
      .catch((error) => {
        console.error(`Could not retrieve all posts in Home: ${error}`);
      });
  }, []);

  return (
    <main className='w-screen h-screen overflow-x-hidden bg-blue-600 dark:bg-gray-700 flex flex-col justify-start items-baseline'>
      {posts && posts.length && userState > 0 ? (
        <ul className='grid grid-cols-4 gap-4'>
          {posts.map((post) => (
            <li key={post.$id}>
              <PreviewCard {...post} />
            </li>
          ))}
        </ul>
      ) : (
        <div className='w-screen flex justify-center'>

        <h1 className='text-center text-white dark:text-gray-300 w-4/6
        py-10 text-5xl bg-blue-400 dark:bg-gray-600 shadow-2xl rounded-3xl font-bold mt-10 '>Please Login To See others Posts</h1>
        </div>
      )}
    </main>
  );
}

export default Home;
