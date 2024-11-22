import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import storageService from '../Appwrite/Storage';

function PreviewCard({ $id, title, featuredImage }) {
  const [postImage, setPostImage] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    storageService.filePreview(featuredImage)
      .then((img) => {
        if (isMounted && img) {
          setPostImage(img);
          setError(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [featuredImage]);

  return (
    <Link className='flex justify-center items-center flex-col' to={`/post/${$id}`}>
      <div
        className="w-11/12 bg-white dark:bg-gray-800 shadow-lg shadow-gray-700 rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 active:scale-90 hover:shadow-xl hover:shadow-gray-600 "
        style={{ minHeight: '350px' }}
      >
        {/* Image Section */}
        {error ? (
          <div
            className="flex items-center justify-center h-48 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
          >
            <span>Image unavailable</span>
          </div>
        ) : (
          <img
            className="w-full h-[30vh] max-h-[40vh] object-fill rounded-xl"
            src={postImage || '/vite.svg'}
            alt={title}
            loading="lazy"
          />
        )}

        {/* Content Section */}
        <div className="p-4 flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
            Click to view more details about this post.
          </p>
        </div>
      </div>
    </Link>
  );
}

export default React.memo(PreviewCard);
