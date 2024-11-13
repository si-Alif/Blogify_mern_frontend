import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import storageService from '../Appwrite/Storage';

function PreviewCard({ $id, title, featuredImage }) {
  const [postImage, setPostImage] = useState("");

  useEffect(() => {
    storageService.filePreview(featuredImage)
      .then((img) => {
        if (img) setPostImage(img);
      })
      .catch((error) => {
        console.error(`Could not get post's preview image from database for preview card ${featuredImage}: ${error}`);
      });
  }, [featuredImage]);

  return (
    <Link to={`/post/${$id}`}>
      <section className='py-3 px-4 rounded-xl bg-blue-100 hover:p-3 duration-500 dark:bg-slate-400 flex flex-col justify-between gap-3 items-center'>
        <img
          className='w-5/6 rounded-lg object-contain'
          src={postImage}
          alt={title}
        />
        <h1 className='text-lg text-black font-semibold dark:text-gray-600 overflow-clip'>
          {title}
        </h1>
      </section>
    </Link>
  );
}

export default PreviewCard;
