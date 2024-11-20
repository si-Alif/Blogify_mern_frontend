import React, { useEffect, useState, useCallback } from "react";
import { Input, Button } from "../utils/utilsIndex.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import authService from "../Appwrite/auth.js";

import ServerSDK from "../Appwrite/ServerSDK.js";
import { debounce } from "lodash";
import storageService from "../Appwrite/Storage.js";

const AdminCard = React.memo(({ admin }) => {
  const [img, setImg] = useState("");

  console.log(admin?.prefs);
  const profilePicture = admin.prefs?.profilePicture;
  const fullName = admin.prefs?.fullName || "Admin User";
  const joinDate = new Date(admin.$createdAt).toLocaleDateString();

  useEffect(() => {
    (async () => {
      if (profilePicture) {
        const PP = await storageService.previewPP(profilePicture);

        if (PP) {
          setImg(PP);
        }
      }
    })();
  }, [profilePicture]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col items-center text-center space-y-4">
      {profilePicture ? (
        <img
          src={img}
          alt={`${fullName}'s Profile`}
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-300 dark:border-blue-600 shadow-md"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 text-2xl">
          <span>{fullName[0]}</span>
        </div>
      )}
      <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">
        {fullName}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{admin.email}</p>
      <p className="text-gray-500 dark:text-gray-500 text-xs">
        Joined on {joinDate}
      </p>
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          admin.status
            ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
            : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
        }`}
      >
        {admin.status ? "Active" : "Inactive"}
      </span>
    </div>
  );
});

function Creator() {
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState(null);

  const fetchUserData = useCallback(
    debounce(async () => {
      try {
        const adminUsers = await ServerSDK.getAdminUsers("admin");
        if (adminUsers) {
          setAdmins(adminUsers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 50),
    []
  );

  useEffect(() => {
    (async () => {
      const currentUser = await authService.getCurrUserData();
      setUser(currentUser);
    })();
    fetchUserData();

    return () => {
      fetchUserData.cancel();
    };
  }, [fetchUserData]);
 
  const handleCreator=async()=>{
    const res=  await ServerSDK.getCreatorLabel(user?.$id)
    console.log(res)
  }

  

  return (
    <>
      <main className="min-h-screen max-w-screen overflow-x-hidden flex flex-col justify-start bg-gray-100 dark:bg-gray-900 p-10">
        {!user?.labels.includes("admin") &&
        !user?.labels.includes("creator") ? (
          <section className="py-10 bg-blue-800 dark:bg-blue-900 overflow-hidden rounded-b-xl max-h-[10vh] flex flex-row justify-evenly items-center">
            <h1 className="shadow-lg shadow-red-300 dark:shadow-red-900 p-5 text-blue-50 dark:text-blue-100 rounded-2xl font-bold text-center text-2xl">
              Become A Creator, Be like them
            </h1>
            <Button
                
              className="shadow-lg shadow-blue-50 dark:shadow-blue-700"
              content="Click Here"
              onClick={handleCreator}
              
            />
          </section>
        ) : null}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {admins?.map((admin) => (
            <Link
              key={admin.$id}
              to={`/creator/edit/${admin.$id}`}
              state={admin}
            >
              <AdminCard key={admin.$id} admin={admin} />
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}

export default Creator;
