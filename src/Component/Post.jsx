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
            likesData.documents.map((like) =>
              ServerSDK.postInteractions(like.userId)
            )
          );
          setLikedByData(
            likedUsers.map((user) => ({
              id: user.$id,
              prefs: user.prefs,
            }))
          );
          
        }

        if (dislikesData) {
          setDislikes(dislikesData.total);
          const dislikedUsers = await Promise.all(
            dislikesData.documents.map((dislike) =>
              ServerSDK.postInteractions(dislike.userId)
            )
          );
          setDislikedByData(dislikedUsers.map((user) =>({
            id: user.$id,
            prefs: user.prefs,
  
          })));
        }
      } catch (error) {
        console.error("Error fetching likes/dislikes:", error);
      }
    };

    fetchLikesAndDislikes();
  }, [postId]);

 if (likedByData) {
  console.log(likedByData)
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
      await databaseService.postComments(postId, userData.$id, comment);
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

  const [commentedByData, setCommentedByData] = useState([]);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await databaseService.getAllComments(postId);
        console.log(commentsData);
        if (commentsData) {
          const userComments = await Promise.all(
            commentsData.documents.map(async (Comment) => {
              const user = await ServerSDK.postInteractions(Comment.userId);
              const profilePicture = await storageService.previewPP(
                user.prefs.profilePicture
              );
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
  }, [postId]);

  if (commentedByData) {
    console.log(commentedByData);
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this post!",
          text: "Hey, check out this amazing post!",
          url: window.location.href,
        })
        .then(() => console.log("Post shared successfully!"))
        .catch((error) => console.error("Error sharing the post:", error));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Post URL copied to clipboard!"))
        .catch((error) => console.error("Error copying URL:", error));
    }
  };
  

  const toggleComments = useCallback(() => setShowComments((prev) => !prev), [showLikedBy]);
  const toggleLikedBy = useCallback(() => setShowLikedBy((prev) => !prev), []);
  const toggleDislikedBy = useCallback(() => setShowDislikedBy((prev) => !prev), []);


  const [updatedLikedBy, setUpdatedLikedBy] = useState([]);
  const [updatedDislikedBy, setUpdatedDislikedBy] = useState([]);
  useEffect(() => {
    const fetchProfilePictures = async (data, setData) => {
      try {
        const updatedData = await Promise.all(
          data.map(async (user) => {
            const profilePictureId = user?.prefs?.profilePicture; 
            const imgData = profilePictureId
              ? await storageService.previewPP(profilePictureId)
              : "/placeholder.jpg";
            return { ...user, img: imgData };
          })
        );
        setData(updatedData);
      } catch (error) {
        console.error("Error fetching profile pictures:", error);
      }
    };
  
    if (likedByData.length > 0) {
      fetchProfilePictures(likedByData, setUpdatedLikedBy);
    }
    if (dislikedByData.length > 0) {
      fetchProfilePictures(dislikedByData, setUpdatedDislikedBy);
    }
  }, [likedByData, dislikedByData]);
  

 if (updatedLikedBy) {
  console.log(updatedLikedBy)
 }
  console.log(userData);


  function Modal({ title, data, onClose }) {
   
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-full max-w-lg rounded-md p-6 space-y-4 bg-gray-700 text-white">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="h-40 overflow-y-auto">
            {data.length > 0 ? (
              data.map((user, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Link to={`/user/:${user.id}`}>
                  <img className="w-10 h-10 rounded-full" src={user.img} alt={user.fullName} />
                  <div>{user.prefs.fullName}</div>
                  </Link>
                </div>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }



  return (
    <main className="min-h-screen p-6 flex flex-col items-center bg-gray-900 text-white">
      {post ? (
        <div className="w-full max-w-3xl shadow-lg rounded-md p-6 space-y-6 bg-gray-800">
          {img!="" && (
           <img src={img} alt="" loading="lazy" className="w-full h-[50vh] object-fill bg-cover bg-center rounded-xl" />
          )}
          <h1 className="text-4xl font-bold text-center">{post.title}</h1>
          <div className="text-lg leading-relaxed">
            {HTMLReactParser(post.content)}
          </div>
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
          <div className="flex justify-around flex-row items-center space-x-4 mt-6">
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
            <button
    onClick={handleShare}
    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center space-x-2"
  >
    🔗 Share
  </button>
          </div>
          {showLikedBy && updatedLikedBy.length > 0 && (
            <Modal title="Liked By" data={updatedLikedBy} onClose={toggleLikedBy} />
          )}

          {showDisikedBy && updatedDislikedBy.length > 0 && (
            <Modal title="Disliked By" data={updatedDislikedBy} onClose={toggleDislikedBy} />
          )}

          {showComments && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="w-full max-w-lg rounded-md p-6 space-y-4 bg-gray-700 text-white">
                <h2 className="text-xl font-bold">Comments</h2>
                <div className="h-40 overflow-y-auto">
                  {commentedByData.length > 0 ? (
                    commentedByData.map((comment, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mb-2"
                      >
                         <Link to={`/user/:${comment.userId}`}>
                        <img
                          className="w-10 h-10 rounded-full"
                          src={comment.img || "/placeholder.jpg"}
                          alt={comment.fullName}
                          />
                          </Link>
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
                <form onSubmit={handleComment} className="space-y-4">
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
