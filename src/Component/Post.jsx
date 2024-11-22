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

        // Process Likes
        if (likesData) {
          setLikes(likesData.total);

          const likedUsers = await Promise.all(
            likesData.documents.map(async (like) => {
              const user = await ServerSDK.postInteractions(like.userId);
              return {
                docId: like.$id,
                postId: like.postId,
                id: user.$id,
                prefs: user.prefs,
              };
            })
          );

          setLikedByData(likedUsers);
        }

        // Process Dislikes
        if (dislikesData) {
          setDislikes(dislikesData.total);

          const dislikedUsers = await Promise.all(
            dislikesData.documents.map(async (dislike) => {
              const user = await ServerSDK.postInteractions(dislike.userId);
              console.log(user);
              return {
                docId: dislike.$id,
                postId: dislike.postId,
                id: user.$id,
                prefs: user.prefs,
              };
            })
          );

          setDislikedByData(dislikedUsers);
        }
      } catch (error) {
        console.error("Error fetching likes/dislikes:", error);
      }
    };

    fetchLikesAndDislikes();
  }, [postId]);

  const handleLike = async () => {
    try {
      const userLiked =
        likedByData.find(
          (user) => user.id === userData.$id && user.postId === postId
        )?.docId || null;

      if (userLiked) {
        await databaseService.unLikePost(userLiked);
        setLikes((prev) => prev - 1);
        setLikedByData((prev) =>
          prev.filter((user) => user.docId !== userLiked)
        );
        console.log("Post unliked successfully.");
      } else {
        const newLikeDoc = await databaseService.postLike(postId, userData.$id);
        setLikes((prev) => prev + 1);
        setLikedByData((prev) => [
          ...prev,
          {
            docId: newLikeDoc.$id,
            postId,
            id: userData.$id,
            prefs: userData.prefs,
          },
        ]);
        console.log("Post liked successfully.");
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const userDisliked =
        dislikedByData.find(
          (user) => user.id === userData.$id && user.postId === postId
        )?.docId || null;

      if (userDisliked) {
        await databaseService.unDislikePost(userDisliked);
        setDislikes((prev) => prev - 1);
        setDislikedByData((prev) =>
          prev.filter((user) => user.docId !== userDisliked)
        );
        console.log("Post undisliked successfully.");
      } else {
        const newDislikeDoc = await databaseService.postDisLike(
          postId,
          userData.$id
        );
        setDislikes((prev) => prev + 1);
        setDislikedByData((prev) => [
          ...prev,
          {
            docId: newDislikeDoc.$id,
            postId,
            id: userData.$id,
            prefs: userData.prefs,
          },
        ]);
        console.log("Post disliked successfully.");
      }
    } catch (error) {
      console.error("Error disliking/undisliking post:", error);
    }
  };

  const [comment, setComment] = useState("");

  const [commentedByData, setCommentedByData] = useState([]);
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const existingComment = commentedByData.find(
        (c) => c.userId === userData.$id && c.commentId
      );
      console.log(existingComment);
      if (existingComment) {
        // Update existing comment
        await databaseService.updateComment({
          docId: existingComment.commentId,
          comment: comment,
          postId: postId,
          userId: existingComment.userId,
        });
        setCommentedByData((prev) =>
          prev.map((c) =>
            c.commentId === existingComment.commentId ? { ...c, comment } : c
          )
        );
        console.log("Comment updated successfully.");
      } else {
        // Add new comment
        const newCommentDoc = await databaseService.postComments(
          postId,
          userData.$id,
          comment
        );
        setCommentedByData((prev) => [
          ...prev,
          {
            commentId: newCommentDoc.docId,
            userId: userData.$id,
            fullName: userData.prefs.fullName,
            comment,
            img: userData.prefs.profilePicture || "/placeholder.jpg",
          },
        ]);
        console.log("Comment posted successfully.");
      }
      setComment("");
    } catch (error) {
      console.error("Error posting/updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await databaseService.deleteComment(commentId);
      setCommentedByData((prev) =>
        prev.filter((comment) => comment.commentId !== commentId)
      );
      console.log("Comment deleted successfully.");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

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
                commentId: Comment.docId,
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

  const toggleComments = useCallback(
    () => setShowComments((prev) => !prev),
    [showLikedBy]
  );
  const toggleLikedBy = useCallback(() => setShowLikedBy((prev) => !prev), []);
  const toggleDislikedBy = useCallback(
    () => setShowDislikedBy((prev) => !prev),
    []
  );

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
    console.log(updatedLikedBy);
  }

  const handleDelete = async () => {
    try {
      await databaseService.deletePost(postId);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  function Modal({ title, data, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-70 flex items-center justify-center z-50">
        <div className="w-full max-w-lg rounded-xl p-6 bg-white dark:bg-gray-800 shadow-lg transform transition-all space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 dark:border-gray-600">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User List */}
          <div className="h-48 overflow-y-scroll space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
            {data.length > 0 ? (
              data.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between shadow-md shadow-gray-500 bg-gray-100 dark:bg-gray-700 p-3 rounded-xl  hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.img}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600"
                    />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user.prefs.fullName}
                    </p>
                  </div>
                  <Link
                    to={`/user/${user.id}`}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Visit {user.prefs.fullName}'s profile
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No users found.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log(post)
  const [author, setAuthor] = useState(null);
  const [authorImage, setAuthorImage] = useState(null)
  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        if (post) {
          const data = await ServerSDK.postInteractions(post.userId);
          if (data) {
            console.log("User Data:", data);
            const img = await storageService.previewPP(data.prefs.profilePicture);
            if(img){
              setAuthorImage(img)
            }
            setAuthor(data);
          }
        }
      } catch (error) {
        console.error("Error fetching author data:", error);
      }
    };
  
    fetchAuthorData();
  }, [post]); // Updated dependency array to track `post` instead of `postId`
  
  if (author) {
    console.log("Author:", author);
  }
  if (authorImage) {
    console.log(authorImage)
  }
  return (
    <main className="min-h-screen w-screen p-6 flex flex-col items-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {post ? (
        <div className="max-w-[90vw] w-full md:w-4/5 lg:w-3/5 shadow-lg rounded-3xl p-8 bg-gradient-to-tr from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          {/* Post Image */}
          {img && (
            <div className="overflow-hidden rounded-xl mb-6">
              <img
                src={img}
                alt="Post Image"
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          {/* Post Title */}
          <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800 dark:text-gray-100">
            {post.title}
          </h1>

          {/* Post Content */}
          <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {HTMLReactParser(post.content)}
          </div>

          {/* Post Details */}
          <div className="mt-6 text-sm space-y-2 text-gray-600 dark:text-gray-400">
            {author!="" && authorImage && (
             
              <Link to={`/creator/edit/${author?.$id}`} className="flex items-center space-x-3" state={author}>
               <img
                src={authorImage}
                alt={author?.fullName}
                className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600"
              />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {author?.name}
              </p>
            </Link>
         )
          
          }
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

          {/* Interaction Buttons */}
          <div className="grid grid-cols-2 gap-4 md:flex md:justify-between items-center mt-8">
            <div className="flex flex-col items-center">
              <button
                onClick={handleLike}
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-md transition"
              >
                👍 <span>{likes}</span>
              </button>
              <button
                onClick={toggleLikedBy}
                className="w-full md:w-auto px-4 py-2 mt-2 bg-gray-300 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                Who Liked
              </button>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={handleDislike}
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-md transition"
              >
                👎 <span>{dislikes}</span>
              </button>
              <button
                onClick={toggleDislikedBy}
                className="w-full md:w-auto px-4 py-2 mt-2 bg-gray-300 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                Who Disliked
              </button>
            </div>
            <button
              onClick={toggleComments}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition"
            >
              💬 Comments
            </button>
            <button
              onClick={handleShare}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-purple-700 transition"
            >
              🔗 Share
            </button>
          </div>

          {/* Modal Sections */}
          {showLikedBy && updatedLikedBy.length > 0 && (
            <Modal
              title="Liked By"
              data={updatedLikedBy}
              onClose={toggleLikedBy}
            />
          )}

          {showDisikedBy && updatedDislikedBy.length > 0 && (
            <Modal
              title="Disliked By"
              data={updatedDislikedBy}
              onClose={toggleDislikedBy}
            />
          )}

          {showComments && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="w-full max-w-lg rounded-2xl p-6 bg-gray-100 dark:bg-gray-800 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Comments
                </h2>
                <div className="h-40  mt-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
                  {commentedByData.length > 0 ? (
                    commentedByData.map((comment, index) => (
                      <div
                        key={comment.commentId}
                        className="flex items-start space-x-4 bg-gray-200 dark:bg-gray-700 p-4 rounded-lg my-3 shadow relative"
                      >
                        <Link to={`/user/${comment.userId}`}>
                          <img
                            className="w-10 h-10 rounded-full"
                            src={comment.img || "/placeholder.jpg"}
                            alt={comment.fullName}
                          />
                        </Link>
                        <section>
                          <p className="font-semibold text-gray-400">
                            {comment.fullName}
                          </p>
                          <p className="text-black dark:text-white">
                            {comment.comment}
                          </p>
                        </section>
                        {comment.userId === userData.$id && (
                          <div className="absolute top-1 right-2 space-x-2">
                            <button
                              onClick={() => {
                                setComment(comment.comment);
                              }}
                              className="text-sm text-blue-500 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteComment(comment.commentId)
                              }
                              className="text-sm text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400">
                      No comments yet.
                    </p>
                  )}
                </div>
                <form onSubmit={handleComment} className="mt-4">
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
                    placeholder="Write your comment..."
                  ></textarea>
                  <div className="flex justify-end mt-3 space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition"
                    >
                      {commentedByData.find((c) => c.comment === comment)
                        ? "Update Comment"
                        : "Post Comment"}
                    </button>
                    <button
                      type="button"
                      onClick={toggleComments}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit/Delete Buttons */}
          {userData?.$id === post?.userId && (
            <div className="flex justify-end mt-8 space-x-4">
              <Link to={`/post/edit/${post.$id}`} state={post}>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition">
                  Edit
                </button>
              </Link>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-gradient-to-r from-red-400 to-red-700 text-white rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Loading post...
        </p>
      )}
    </main>
  );
}

export default Post;
