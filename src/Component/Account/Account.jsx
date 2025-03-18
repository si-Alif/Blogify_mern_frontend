import React, { useEffect, useState, useCallback } from "react";
import { debounce, isEqual } from "lodash";
import { useSelector } from "react-redux";

import authService from "../../Appwrite/auth";


function Account({ userId, isAuthenticated }) {

  const ownerAccount = useSelector((state) => state.auth.userInfo);
  const [error, setError] = useState(null);

  const [addedLinks, setAddedLinks] = useState([]);
  const [data, setData] = useState({});

  const [links, setLinks] = useState({
    // whatsapp: "",
    facebook: "",
    youtube: "",
    reddit: "",
    // discord: "",
    twitter:"",
  });


  useEffect(()=>{
    (async()=>{

      const data = await authService.getCurrUserData()
      if (data){
        console.log(data)
        setData(data.data?.user)
        setLinks(data?.socialMediaHandles)

      }
    })()

  },[])



  const isOwner = data?._id === ownerAccount?._id;
  console.log(isOwner)
  // // Fetch user data with debounce
  // const fetchUserData = useCallback(
  //   debounce(async (userId, controller) => {
  //     if (!userId) return;
  //     if (!isOwner) {

  //       try {
  //         const info = await ServerSDK.postInteractions(userId);


  //     } catch (error) {
  //       if (error.name !== "AbortError") {
  //         console.error("Error fetching user data:", error);
  //         setError("Failed to fetch user data. Please try again later.");
  //       }
  //     }
  //   }else{
  //     setData(ownerAccount);
  //     setLinks(ownerAccount?.socialMediaHandles)

  //   }
  //   }, 50),
  //   []
  // );

  // // Effect to fetch user data on mount and cleanup
  // useEffect(() => {
  //   const controller = new AbortController();
  //   fetchUserData(userId, controller);
  //   return () => {
  //     controller.abort();
  //     fetchUserData.cancel();
  //   };
  // }, [userId , fetchUserData]);

  const handleAddLink = async (e) => {
    e.preventDefault();

    // Avoid redundant updates
    if (!isEqual(addedLinks, Object.entries(updatedLinks))) {
      setAddedLinks(Object.entries(updatedLinks));
    }

    try {
      const prefs = await authService.updateUserPrefs({
        socialMedia: updatedLinks,
      });

      if (prefs) {
        console.log("Social media links updated successfully:", prefs);
      }
    } catch (error) {
      console.error("Error updating social media links:", error);
      setError("Failed to update social media links. Please try again later.");
    }
  };


  return (
    <main className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-r from-blue-400 to-blue-600 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-4xl h-full bg-white rounded-lg shadow-lg dark:bg-gray-900 overflow-hidden">
        {isAuthenticated && data ? (
          <div>
            {/* Header */}
            <div className="text-center p-6 bg-blue-500 text-white dark:bg-gray-800">
              <h2 className="text-4xl font-bold">Account Information</h2>
              <p className="text-lg mt-2">
                Welcome back, {data.usename || "User"}!
              </p>
            </div>

            {/* User Info */}
            <div className="p-6 space-y-6">
              {data && (
                <div className="flex justify-center">
                  <img
                    contentEditable={true}
                    className="max-w-full max-h-[60vh] object-cover rounded-full shadow-lg border-4 border-blue-500 dark:border-gray-700"
                    src={data?.avatar}
                    alt="Profile Preview"
                  />
                </div>
              )}
              <div className="space-y-4">
                {data?.fullName && (
                  <div className="flex items-center justify-between bg-blue-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Full Name:
                    </span>
                    <span className="text-gray-800 dark:text-gray-400">
                      {data.fullName}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between bg-blue-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    User ID:
                  </span>
                  <span className="text-gray-800 dark:text-gray-400">
                    {data?._id || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-blue-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Email:
                  </span>
                  <span className="text-gray-800 dark:text-gray-400">
                    {data.email || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300">
                Social Media Links
              </h3>

              {isOwner ? (
                <form
                  onSubmit={handleAddLink}
                  className="flex flex-col gap-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.keys(links).map((platform) => (
                      <div key={platform} className="flex items-center gap-3">
                        <img
                          className="w-6 h-6"
                          src={`/icons/${platform}.png`}
                          alt={`${platform} logo`}
                        />
                        <input
                          type="text"
                          placeholder={`Add your ${platform} link`}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-300"
                          value={links[platform]}
                          onChange={(e) =>
                            setLinks({ ...links, [platform]: e.target.value })
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                  >
                    Save Links
                  </button>
                </form>
              ) : null}

              {/* Display Added Links */}
              {links?.length > 0 ? (
                <div className="mt-6">

                  <div className="flex flex-wrap gap-4 mt-4">
                    {addedLinks.map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-gray-800 rounded-full shadow-md hover:scale-110 transition"
                      >
                        <img
                          className="w-8 h-8"
                          src={`/icons/${platform}.png`}
                          alt={`${platform} logo`}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No social profiles added yet.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-600 dark:text-gray-400">
            Please log in to view your account information.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center p-4">{error}</p>
        )}
      </div>
    </main>
  );
}

export default Account;
