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
    <Link to={`/post/${$id}`}>
      <section
        className="lg:max-h-[40vh] max-h-[20vh] sm:max-h-[30vh] lg:min-h-[35vh] sm:min-h-[25vh] object-cover py-3 px-4 rounded-xl bg-blue-100 hover:p-3 duration-500 dark:bg-slate-400 flex flex-col justify-between gap-3 items-center"
        style={{ minHeight: "25vh", width: "100%" }} 
      >
        {/* Image Section */}
        {error ? (
          <div
            className="w-5/6 h-[25vh] flex justify-center items-center bg-gray-200 rounded-lg dark:bg-gray-500"
            style={{ width: "100%", height: "200px" }}
          >
            <span className="text-gray-500 dark:text-gray-300">Image unavailable</span>
          </div>
        ) : (
          <img
            className="w-5/6 rounded-lg object-contain max-h-[25vh] transition-opacity duration-300"
            src={postImage || '/vite.svg'} 
            alt={title}
            width="300" 
            height="200" 
            loading="lazy" 
          />
        )}

        {/* Title Section */}
        <h1 className="text-lg text-black font-semibold dark:text-gray-600 overflow-hidden text-ellipsis max-h-16">
          {title}
        </h1>
      </section>
    </Link>
  );
}

export default React.memo(PreviewCard);
