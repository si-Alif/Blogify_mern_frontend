import React, { useState } from "react";
import { Input, Button } from "../utils/utilsIndex.js";
import { useForm, Controller } from "react-hook-form";
import { AccountCircle } from "@mui/icons-material";
import authService from "../Appwrite/auth.js";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../ReduxStore/auth.js";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage(""); // Reset error message on new submission
    try {
      const loginResponse = await authService.login(data);



      if (loginResponse) {
         dispatch(
          login({
            userInfo: loginResponse,
            isAuthenticated:true
          })
        )
        navigate("/")
      } else {
        setErrorMessage("Invalid Email or Password. Please try again."); // Set error message
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMessage(
        error.message || "An unexpected error occurred. Please try again."
      ); // Display error message
    }
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 via-cyan-200 to-blue-300 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-96 bg-white rounded-3xl px-8 py-10 shadow-2xl flex flex-col items-center gap-5"
      >
        <AccountCircle sx={{ fontSize: 100, color: "#3b82f6" }} />
        <h2 className="text-xl font-semibold text-gray-700 text-center">
          Welcome Back!
        </h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up Here
          </Link>
        </p>

        {/* Error Message Display */}
        {errorMessage && (
          <div className="w-full p-3 text-sm text-red-600 bg-red-100 border border-red-400 rounded-md text-center">
            {errorMessage}
          </div>
        )}

        {/* Email Input */}
        <div className="w-full">
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
            render={({ field }) => (
              <Input
                {...field}
                label="Email Address"
                type="email"
                className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
              />
            )}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="w-full">
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                label="Password"
                type="password"
                className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
              />
            )}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
  type="submit"
  className={`w-full p-3 text-white rounded-md text-lg ${
    loading
      ? "bg-blue-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
  disabled={loading}
>
  {loading ? (
    <div className="flex items-center justify-center">
      <svg
        className="animate-spin h-5 w-5 mr-2 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
        ></path>
      </svg>
      Logging In...
    </div>
  ) : (
    "Login"
  )}
</Button>

      </form>
    </main>
  );
}

export default Login;
