import React from 'react'
import {Input , Button} from "../utils/utilsIndex.js"
import {useForm} from "react-hook-form"
import { Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import authService from '../Appwrite/auth.js'

function SignUp() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { register, handleSubmit , control } = useForm()

  const userStatus = useSelector(state=>state.auth.isAuthenticated)

  const onSubmit =async (data) => {

    const loginSession = await authService.signup(
        {...data},
        navigate,
        dispatch
    )
    console.log(loginSession)
   console.log(loginSession && userStatus)
   console.log(userStatus)
  }


  return (
    <>
      <main className='w-screen h-screen overflow-hidden flex flex-col justify-center items-center bg-cyan-100' onSubmit={handleSubmit(onSubmit)}>
        <form className='flex flex-col justify-center items-center gap-3  bg-slate-400 rounded-3xl px-16 py-8 shadow-2xl shadow-zinc-700'>
        <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className={"w-[25vw] p-7"}
                label={"Enter your Full Name"}
                type={"text"}
                inputStyle={{color: "black"  }}
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
                inputStyle={{color: "black"  }}
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
                inputStyle={{color: "black"  }}
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
                inputStyle={{color: "black"  }}
                required={true}
                icon={false}
              />
            )}
          />

          <Button
            className={'bg-blue-700 text-white text-xl'}
            textColor='bg-cyan-600'
            label={"Sign Up"}
            icon={"false"}
            type={"submit"}
          />

        </form>
      </main>
    </>
  )
}

export default SignUp


