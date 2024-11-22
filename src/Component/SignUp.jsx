import React, { useState } from "react";
import { Input, Button, UploadFileBtn } from "../utils/utilsIndex.js";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../Appwrite/auth.js";
import storageService from "../Appwrite/Storage.js";
import { login } from "../ReduxStore/auth.js";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { 
    register, 
    handleSubmit, 
    control, 
    setError, 
    formState: { errors } 
  } = useForm();

  const [formError, setFormError] = useState("");

  const onSubmit = async (data) => {
    try {
      setFormError(""); // Clear previous errors

      const avatar = await storageService.uploadProfilePicture(data.PP);
      if (avatar) {
        data.PP = avatar.$id;

        const loginSession = await authService.signup(data, navigate, dispatch);
        if (loginSession.error) {
          throw new Error(loginSession.error.message);
        }

       
        dispatch(login({ userInfo: loginSession.userInfo , session: loginSession.session}));
      }
    } catch (err) {
      if (err.message.includes("email")) {
        setError("email", { type: "manual", message: "Please enter a valid email address." });
      } else {
        setFormError(err.message);
      }
    }
  };

  return (
    <main
      className="w-full min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-500 to-blue-700 flex items-center justify-center p-6"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-8 flex flex-col lg:flex-row items-center gap-8"
      >
        {/* General Form Error */}
        {formError && (
          <div className="w-full text-center text-red-500 font-semibold bg-red-100 border border-red-400 rounded-lg p-4 shadow-xl shadow-gray-500 flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 9v2.25m0 3.375h.007v.008h-.007v-.008zm-2.624-9.208a8.625 8.625 0 1111.748 0 8.625 8.625 0 01-11.748 0zm11.748 0L13.125 15"
              />
            </svg>
            {formError}
          </div>
        )}

        {/* Left Side (Form Inputs) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="w-full p-4 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                label="Full Name"
                type="text"
                required
              />
            )}
          />
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="w-full p-4 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                label="Username"
                type="text"
                required
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  className={`w-full p-4 rounded-md border-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  label="Email Address"
                  type="email"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="w-full p-4 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                label="Password"
                type="password"
                required
              />
            )}
          />
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl py-3 rounded-md font-semibold shadow-md hover:scale-105 transform transition-all"
            label="Sign Up"
            type="submit"
          />
        </div>

        {/* Right Side (Profile Picture Upload) */}
        <div className="w-full lg:w-1/2 flex flex-col items-center gap-4">
          <label
            htmlFor="featuredImage"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium cursor-pointer hover:shadow-lg transform transition-all"
          >
            Upload Profile Picture
          </label>
          <Controller
            name="PP"
            control={control}
            render={({ field }) => (
              <UploadFileBtn
                {...field}
                defaultValue="/user-profile.png"
                imgClass="rounded-full h-48 w-48 object-cover shadow-lg"
              />
            )}
          />
        </div>
      </form>
    </main>
  );
}

export default SignUp;
