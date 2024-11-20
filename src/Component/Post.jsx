import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import databaseService from "../Appwrite/DB";
import storageService from "../Appwrite/Storage";
import HTMLReactParser from "html-react-parser";
import { Link } from "react-router-dom";
import ServerSDK from "../Appwrite/ServerSDK";

function Post() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userInfo);
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [img, setImg] = useState("");
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [likedByData, setLikedByData] = useState([]);
  const [dislikedByData, setDislikedByData] = useState([]);
  const [comments, setComments] = useState([]);
  const [showLikedBy, setShowLikedBy] = useState(false);
  const [showDisikedBy, setShowDislikedBy] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const likedByFetched = useRef(false);
  const dislikedByFetched = useRef(false);
  const commentsFetched = useRef(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await databaseService.getPost(postId);
        if (response) setPost(response);

        if (response?.featuredImage) {
          const file = await storageService.filePreview(response.featuredImage);
          setImg(file);
        }
      } catch (error) {
        console.error("Error fetching post or image:", error);
      }
    };

    fetchPostData();
  }, [postId]);

  useEffect(() => {
    const fetchLikesAndDislikes = async () => {
      try {
        const [likesData, dislikesData] = await Promise.all([
          databaseService.getAllLikes(postId),
          databaseService.getAllDislikes(postId),
        ]);

        if (likesData) {
          setLikes(likesData.total);
          const likedUsers = await Promise.all(
            likesData.documents.map((like) => ServerSDK.postInteractions(like.userId))
          );
          setLikedByData(likedUsers.map((user) => user.prefs));
        }

        if (dislikesData) {
          setDislikes(dislikesData.total);
          const dislikedUsers = await Promise.all(
            dislikesData.documents.map((dislike) => ServerSDK.postInteractions(dislike.userId))
          );
          setDislikedByData(dislikedUsers.map((user) => user.prefs));
        }
      } catch (error) {
        console.error("Error fetching likes/dislikes:", error);
      }
    };

    fetchLikesAndDislikes();
  }, [postId]);
  const [commentedByData, setCommentedByData] = useState([])
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await databaseService.getAllComments(postId);
        console.log(commentsData)
        if (commentsData) {
          const userComments = await Promise.all(
            commentsData.documents.map(async (Comment) => {
              const user = await ServerSDK.postInteractions(Comment.userId);
              const profilePicture = await storageService.previewPP(user.prefs.profilePicture);
              return {
                userId: Comment.userId,
                comment: Comment.comment,
                fullName: user.prefs.fullName,
                img: profilePicture || "/placeholder.jpg", 
              };
            })
          );
          setCommentedByData(userComments.map((user) => user));
          
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
  
    fetchComments();
  }, []);

if (commentedByData) {
  console.log(commentedByData)
  
}
  

  const handleLike = async () => {
    try {
      await databaseService.postLike(postId, userData.$id);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDislike = async () => {
    try {
      await databaseService.postDisLike(postId, userData.$id);
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await databaseService.deletePost(postId);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const [comment, setComment] = useState("");

  const handleComment = async (e) => {
    e.preventDefault(); 
    if (!comment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
    try {
      await databaseService.postComments(postId, userData.$id , comment);
      setComments((prev) => [
        ...prev,
        { comment, userId: userData.$id, fullName: userData.fullName }, 
      ]);
      setComment(""); 
      alert("Comment added successfully.");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  
  const toggleComments = () => setShowComments((prev) => !prev);
  const toggleLikedBy = () => setShowLikedBy((prev) => !prev);
  const toggleDislikedBy = () => setShowDislikedBy((prev) => !prev);

  const [updatedLikedBy, setUpdatedLikedBy] = useState([])
  useEffect(() => {
    const fetchProfilePictures = async () => {
      try {
        const updatedLikedBy = await Promise.all(
          likedByData.map(async (user) => {
            const imgData = await storageService.previewPP(user?.profilePicture);
            return { ...user, img: imgData || "/placeholder.jpg" }; // Add the fetched image URL or fallback
          })
        );
        setUpdatedLikedBy(updatedLikedBy) // Update state with the fetched images
      } catch (error) {
        console.error("Error fetching profile pictures:", error);
      }
    };

    if (likedByData.length > 0) {
      fetchProfilePictures();
    }
  }, [likedByData]);
  const [updatedDislikedBy, setUpdatedDislikedBy] = useState([])
  useEffect(() => {
    const fetchProfilePictures = async () => {
      try {
        const updatedDislikedBy = await Promise.all(
          dislikedByData.map(async (user) => {
            const imgData = await storageService.previewPP(user?.profilePicture);
            return { ...user, img: imgData || "/placeholder.jpg" };
          })
        );
        setUpdatedDislikedBy(updatedDislikedBy)
      } catch (error) {
        console.error("Error fetching profile pictures:", error);
      }
    };

    if (likedByData.length > 0) {
      fetchProfilePictures();
    }
  }, [dislikedByData]);

  

  // const [updatedCommentBy, setUpdatedCommentBy] = useState([])
  // useEffect(() => {
  //   const fetchProfilePictures = async () => {
  //     try {
  //       const updatedDislikedBy = await Promise.all(
  //         comments?.map(async (user) => {
  //           const imgData = await storageService.previewPP(user?.profilePicture);
  //           return { ...user, img: imgData || "/placeholder.jpg" };
  //         })
  //       );
  //       setUpdatedCommentBy(updatedDislikedBy)
  //     } catch (error) {
  //       console.error("Error fetching profile pictures:", error);
  //     }
  //   };

  //   if (likedByData.length > 0) {
  //     fetchProfilePictures();
  //   }
  // }, [comments]);


  // console.log(updatedCommentBy)

  console.log(userData)

  return (
    <main className="min-h-screen p-6 flex flex-col items-center bg-gray-900 text-white">
      {post ? (
        <div className="w-full max-w-3xl shadow-lg rounded-md p-6 space-y-6 bg-gray-800">
          {img && (
            <div
              className="w-full h-72 bg-cover bg-center rounded-md"
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          )}
          <h1 className="text-4xl font-bold text-center">{post.title}</h1>
          <div className="text-lg leading-relaxed">{HTMLReactParser(post.content)}</div>
          <div className="text-sm space-y-2">
            <p>
              <span className="font-semibold">Author:</span> {post.createdBy}
            </p>
            <p>
              <span className="font-semibold">Created At:</span>{" "}
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
          <div className="flex justify-between items-center space-x-4 mt-6">
            <span className="w-1/4 flex flex-col justify-center gap-3 items-center">
              <button
                onClick={handleLike}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                👍 <span>{likes}</span>
              </button>
              <button
                onClick={toggleLikedBy}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Who Liked
              </button>
            </span>
            <span className="w-1/4 flex flex-col justify-center gap-3 items-center">
              <button
                onClick={handleDislike}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2"
              >
                👎 <span>{dislikes}</span>
              </button>
              <button
                onClick={toggleDislikedBy}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Who Disliked
              </button>
            </span>
            <button
              onClick={toggleComments}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              💬 Comments
            </button>
          </div>
          {showLikedBy && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="w-full max-w-lg rounded-md p-6 space-y-4 bg-gray-700 text-white">
                <h2 className="text-xl font-bold">Liked By</h2>
                <div className="h-40 overflow-y-auto">
                  {updatedLikedBy.length > 0 ? (
                    updatedLikedBy.map((user, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={user.img} // Use the pre-fetched image
                          alt={user.fullName}
                        />
                        <div>{user.fullName}</div>
                        <div>{user.comment}</div>
                      </div>
                    ))
                  ) : (
                    <p>No likes yet.</p>
                  )}

                </div>
                <button
                  onClick={toggleLikedBy}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {showDisikedBy && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="w-full max-w-lg rounded-md p-6 space-y-4 bg-gray-700 text-white">
                <h2 className="text-xl font-bold">Disliked By</h2>
                <div className="h-40 overflow-y-auto">
                  {updatedDislikedBy.length > 0 ? (
                    updatedDislikedBy.map((user, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={user.img || "/placeholder.jpg"}
                          alt={user.fullName}
                        />
                        <div>{user.fullName}</div>
                      </div>
                    ))
                  ) : (
                    <p>No dislikes yet.</p>
                  )}
                </div>
                <button
                  onClick={toggleDislikedBy}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {showComments && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="w-full max-w-lg rounded-md p-6 space-y-4 bg-gray-700 text-white">
                <h2 className="text-xl font-bold">Comments</h2>
                <div className="h-40 overflow-y-auto">
                  {commentedByData.length > 0 ? (
                    commentedByData.map((comment, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={comment.img || "/placeholder.jpg"}
                          alt={comment.fullName}
                        />
                        <div>
                          <p className="font-semibold">{comment.fullName}</p>
                          <p>{comment.comment}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>
                <form
                  onSubmit={handleComment}
                  className="space-y-4"
                >
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)} // Update the comment state on input change
                    className="w-full border rounded-md p-2 bg-gray-600 text-white"
                    placeholder="Write your comment..."
                  ></textarea>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Post Comment
                    </button>
                    <button
                      type="button"
                      onClick={toggleComments}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}
          {userData?.$id === post?.userId && (
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
