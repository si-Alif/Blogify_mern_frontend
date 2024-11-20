import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import storageService from "../Appwrite/Storage";

const CreatorProfile = () => {
  // Retrieve data passed via `state`
  const location = useLocation();
  const creator = location.state;

  // Fallback for missing data
  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <h1 className="text-2xl font-bold">No creator data found!</h1>
        <Link to="/" className="mt-4 text-blue-500 hover:underline">
          Go back to Dashboard
        </Link>
      </div>
    );
  }

  const { fullName, email,  status } = creator;
   const joinDate = new Date(creator.$createdAt).toLocaleDateString();
  console.log(creator)

  const [img, setImg] = React.useState(null);
  
  useEffect(() => {
    (async () => {
      if (creator) {
        const PP = await storageService.previewPP(creator.prefs?.profilePicture);

        if (PP) {
          setImg(PP);
        }
      }
    })()
  },[creator])

  return (
    <main className="max-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center p-10">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-3xl space-y-6">
        {/* Profile Section */}
        <div className="flex items-center space-x-6">
          {img ? (
            <img
              src={img}
              alt={`${fullName}'s Profile`}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-300 dark:border-blue-600"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 text-2xl">
              <span>{fullName}</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{creator.prefs?.fullName}</h1>
            <p className="text-gray-600 dark:text-gray-400">{email}</p>
          </div>
        </div>

        {/* Join Date */}
        <p className="text-gray-500 dark:text-gray-400">
          Joined on: <span className="font-semibold">{joinDate}</span>
        </p>

        {/* Status */}
        <span
          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
            status
              ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
              : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
          }`}
        >
          {status ? "Active" : "Inactive"}
        </span>

        {/* Back Button */}
        <Link
          to="/"
          className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
};

export default CreatorProfile;
