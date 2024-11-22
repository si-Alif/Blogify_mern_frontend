import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import storageService from "../Appwrite/Storage";

const CreatorProfile = () => {
  const location = useLocation();
  const creator = location.state;

  const [img, setImg] = useState(null);

  useEffect(() => {
    (async () => {
      if (creator?.prefs?.profilePicture) {
        const PP = await storageService.previewPP(creator.prefs.profilePicture);
        if (PP) setImg(PP);
      }
    })();
  }, [creator]);
  console.log(creator);

  if (!creator) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <h1 className="text-2xl font-bold">No creator data found!</h1>
        <Link
          to="/"
          className="mt-4 text-blue-500 dark:text-blue-400 hover:underline"
        >
          Go back to Dashboard
        </Link>
      </div>
    );
  }

  const { fullName, email, status } = creator.prefs || {};
  const joinDate = new Date(creator.$createdAt).toLocaleDateString();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 dark:from-gray-800 dark:to-gray-900 p-6 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden w-full max-w-4xl">
        <div className="relative bg-gradient-to-r from-blue-400 to-blue-600 dark:from-gray-700 dark:to-gray-900 pb-32 pt-12">
          <div className="absolute inset-x-0 bottom--10 flex justify-center">
            {img ? (
              <img
                src={img}
                alt={`${fullName}'s Profile`}
                className="w-48 h-48 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-4xl font-bold shadow-lg">
                {fullName?.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 pt-16">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {fullName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{email}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Joined on:{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {joinDate}
              </span>
            </p>
          </div>

          {/* Status Badge */}
          <div className="mt-6 flex justify-center">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                status
                  ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {status ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <Link
              to="/"
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-md dark:bg-blue-700 dark:hover:bg-blue-800 transition duration-300"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreatorProfile;
