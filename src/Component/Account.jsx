import authService from "../Appwrite/auth";
import { useSelector } from "react-redux";
import React, { useEffect, useState, useMemo } from "react";
import { debounce } from "lodash";

function Account() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [data, setData] = useState(null);

  // Memoize userInfo.$id to avoid unnecessary re-renders if the object reference changes
  const userId = useMemo(() => userInfo?.$id, [userInfo?.$id]);

  useEffect(() => {
    // Define the fetch function with debounce and unsubscribe logic
    const fetchUserData = debounce(async (userId, controller) => {
      if (!userId) return;
      try {
        const info = await authService.getCurrUserData(userId, { signal: controller.signal });
        setData(info);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching user data:", error);
        }
      }
    }, 50); // 300ms debounce delay

    const controller = new AbortController(); // For unsubscribing

    fetchUserData(userId, controller);

    // Cleanup function to cancel the request if userInfo changes or component unmounts
    return () => {
      controller.abort();
      fetchUserData.cancel(); // Cancel debounce if component unmounts or dependencies change
    };
  }, [userId]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 sm:p-10">
        {isAuthenticated ? (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Account Information
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Welcome back, {data?.name || "User"}!
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700 dark:text-gray-300">User ID:</span>
                <span className="text-gray-600 dark:text-gray-400">{data?.$id || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span>
                <span className="text-gray-600 dark:text-gray-400">{data?.email || "N/A"}</span>
              </div>
              {data?.name && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Full Name:</span>
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
