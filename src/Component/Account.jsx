import authService from "../Appwrite/auth";
import { useSelector } from "react-redux";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import storageService from "../Appwrite/Storage";

function Account({userId , isAuthenticated}) {
  const [data, setData] = useState(null);
  const [img, setImg] = useState("");


  const fetchUserData = useCallback(
    debounce(async (userId, controller) => {
      if (!userId) return;
      try {
        const info = await authService.getCurrUserData(userId, { signal: controller.signal });
        setData(info);
        
       
        if (info.prefs.profilePicture) {
          const previewURL = await storageService.previewPP(info.prefs.profilePicture);
          setImg(previewURL);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching user data:", error);
        }
      }
    }, 50),
    []
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchUserData(userId, controller);

    return () => {
      controller.abort();
      fetchUserData.cancel();
    };
  }, [userId, fetchUserData]);

  console.log(img)
  console.log(data)

  return (
    <main className="w-screen flex items-center overflow-x-hidden justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="bg-white w-4/5 dark:bg-gray-800 rounded-lg shadow-lg max-w-5xl p-6 sm:p-10">
        {isAuthenticated ? (
          <>  
            <div className="text-center ">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Account Information
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Welcome back, {data?.name || "User"}!
              </p>
            </div>
            <div className="space-y-4">
              {img && (
                <div className="flex items-center justify-center">
                  <img
                    className="h-2/5 w-3/5 object-cover rounded-lg"
                    src={img}
                    alt="Profile Preview"
                  />
                </div>
              )}
              {data?.prefs.fullName && (
                <div className="flex items-center justify-center gap-5">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Full Name:</span>
                  <span className="text-gray-600 dark:text-gray-400">{data.prefs.fullName}</span>
                </div>
              )}
              <div className="flex items-center justify-center gap-5">
                <span className="font-semibold text-gray-700 dark:text-gray-300">User ID:</span>
                <span className="text-gray-600 dark:text-gray-400">{data?.$id || "N/A"}</span>
              </div>
              <div className="flex items-center justify-center gap-5">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span>
                <span className="text-gray-600 dark:text-gray-400">{data?.email || "N/A"}</span>
              </div>
              {data?.name && (
                <div className="flex items-center justify-center gap-5">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Name:</span>
                  <span className="text-gray-600 dark:text-gray-400">{data.name}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Please log in to view your account information.
          </p>
        )}
      </div>
    </main>
  );
}

export default Account;
