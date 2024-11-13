import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import databaseService from "../Appwrite/DB";
import storageService from "../Appwrite/Storage";
import HTMLReactParser from "html-react-parser";
import { Link } from "react-router-dom";

function Post() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userInfo);
  console.log(userData);
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [img, setImg] = useState("");

  console.log(post);
  useEffect(() => {
    let isMounted = true; // Track component mount status

    const fetchPostData = async () => {
      try {
        const response = await databaseService.getPost(postId);
        if (isMounted) {
          setPost(response);
          if (response?.featuredImage) {
            const file = await storageService.filePreview(
              response.featuredImage
            );
            if (isMounted) setImg(file);
          }
        }
      } catch (error) {
        console.error("Error fetching post or image:", error);
      }
    };

    fetchPostData();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleDelete = async () => {
    try {
      await databaseService.deletePost(postId);
      navigate("/"); // Redirect to home after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <main className="w-[80vw] flex flex-col items-center p-4">
      {post ? (
        <div className="w-full max-w-3xl bg-gray-100 shadow-lg rounded-md p-6 space-y-4">
          {img && (
            <div
              className="w-full h-64 bg-cover bg-center rounded-md mb-4"
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          )}
          <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
          <div className="text-lg text-gray-700">
            {HTMLReactParser(post.content)}
          </div>
          <div className="text-sm text-gray-500">
            <p>Author: {post.createdBy}</p>
            <p>
              Created At:{" "}
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              }).format(new Date(post.$createdAt))}
            </p>
          </div>
          {userData?.userId === post?.userId && (
            <div className="flex space-x-4 mt-4">
              <Link to={`/post/edit/${post.$id}`} state={post}>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit
                </button>
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading post...</p>
      )}
    </main>
  );
}

export default Post;
