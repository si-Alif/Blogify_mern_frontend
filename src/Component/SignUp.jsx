import React,{useState} from "react";
import { Input, Button, UploadFileBtn } from "../utils/utilsIndex.js";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../Appwrite/auth.js";
import storageService from "../Appwrite/Storage.js";
import { login } from "../ReduxStore/auth.js";
import databaseService from "../Appwrite/DB.js";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, control } = useForm();

  const userStatus = useSelector((state) => state.auth.isAuthenticated);
  const [error, setError] = useState("")
  const onSubmit = async (data) => {
    console.log(data);

    const avatar = await storageService.uploadProfilePicture(data.PP);
    if (avatar) {
      const avatarId = avatar.$id;
      data.PP = avatarId;

    const loginSession  = await authService.signup(
        { ...data },
        navigate,
        dispatch
    );
    console.log(loginSession)
    
    if (loginSession) {
      const userData = await authService.getCurrUserData();

      dispatch(login({userInfo: userData}))
    }
      // setError(loginSession)
   
    }
  };

  return (
    <>
      <main
        className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center bg-cyan-100"
        onSubmit={handleSubmit(onSubmit)}
      >
        <form className="flex flex-row justify-evenly items-center w-5/6">
        {
          error && (
            <div className="text-red-500 text-center w-full">
              {error}
            </div>
          )
        }
          <aside className="flex flex-col justify-center items-center gap-3  bg-slate-400 rounded-3xl px-16 py-8 shadow-2xl shadow-zinc-700">
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className={"w-[25vw] p-7"}
                  label={"Enter your Full Name"}
                  type={"text"}
                  required={true}
                  icon={true}
                />
              )}
            />
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className={"w-[25vw] p-7"}
                  label={"Enter username"}
                  type={"text"}
                  inputStyle={{ color: "black" }}
                  required={true}
                  icon={true}
                />
              )}
            />
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
              label={"Sign Up"}
              icon={"false"}
              type={"submit"}
            />
          </aside>
          <aside className="flex justify-around items-center flex-col w-5/12 h-full  rounded-2xl">
            <label
              htmlFor="featuredImage"
              className="bg-blue-600 py-5 px-8 text-xl font-semibold rounded-2xl text-gray-800 dark:text-white"
            >
              Upload A Profile Picture
            </label>
            <Controller
              name="PP"
              control={control}
              render={({ field }) => (
                <UploadFileBtn
                  {...field}
                  defaultValue={"/user-profile.png"}
                  imgClass="rounded-full h-96 w-full object-cover"
                  onChange={(file) => field.onChange(file)}
                />
              )}
            />
          </aside>
        </form>
      </main>
    </>
  );
}

export default SignUp;
