import React from "react";
import { Input, Button } from "../utils/utilsIndex.js";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { AccountCircle } from "@mui/icons-material";
import authService from "../Appwrite/auth.js";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import databaseService from "../Appwrite/DB.js";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, control } = useForm();

  const userStatus = useSelector((state) => state.auth.isAuthenticated);

  const onSubmit = async (data) => {
    const loginSession = await authService.login(
      { ...data },
      navigate,
      dispatch
    );
    console.log(loginSession);
    console.log(loginSession && userStatus);
  };

  return (
    <>
      <main
        className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center bg-cyan-100"
        onSubmit={handleSubmit(onSubmit)}
      >
        <form className="flex flex-col justify-center items-center gap-3  bg-slate-400 rounded-3xl px-16 py-8 shadow-2xl shadow-zinc-700">
          <AccountCircle sx={{ color: "action.active", fontSize: 180 }} />
          <div className="py-6 px-10 text-center rounded-xl shadow-md max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Please Login to Your Account!
            </h2>
            <div className="text-sm text-gray-500">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition duration-200 ease-in-out"
              >
                Click here to Sign UP
              </Link>
            </div>
          </div>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className={"w-[25vw] p-7"}
                label={"Enter your email address"}
                type={"email"}
                inputStyle={{ color: "black" }}
                required={true}
                icon={true}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className={"w-[25vw] p-7"}
                label={"Enter Password"}
                type={"password"}
                inputStyle={{ color: "black" }}
                required={true}
                icon={false}
              />
            )}
          />

          <Button
            className={"bg-blue-700 text-white text-xl"}
            textColor="bg-cyan-600"
            label={"Login"}
            icon={"false"}
            type={"submit"}
          />
        </form>
      </main>
    </>
  );
}

export default Login;
