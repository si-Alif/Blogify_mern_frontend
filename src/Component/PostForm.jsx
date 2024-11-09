import { useForm, Controller } from "react-hook-form"
import {Tags , Input ,UploadFileBtn , PostStatus , Button} from "../utils/utilsIndex.js"
import RTE from "./RTE.jsx"


const PostForm = ({post}) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: post?.title || "",
      tags: post?.tags || [],
      featuredImage: post?.featuredImage ||"",
      content: post?.content ||"",
      status: post?.status || "",
    },
  })
  const onSubmit = (data) => console.log(data)


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-10 flex flex-col items-center gap-[5vh]">
       <section className="w-screen h-[50vh] flex flex-row justify-evenly items-center">
      <aside className="w-3/5 h-full flex flex-col justify-evenly items-center">

      <Controller
        name="title"
        control={control}
        render={({ field }) => <Input {...field} className={"w-[55vw] p-7"} label={"Enter Post Title"} type={"text"} value={field.value || ""} required={true} icon={true} />}
        />
      <div className="w-full h-4/6 flex flex-row justify-around items-center">

      <Controller
        name="tags"
        control={control}
        render={({ field }) => <Tags {...field} vals={[
          "React",
          "JavaScript",
          "CSS",
          "HTML",
          "Node.js",
          "MongoDB",
        ]}
        value={field.value ||[]}
        />}
        />
        <Controller
        name="status"
        control={control}
        render={({ field }) => <PostStatus {...field} value={field.value || ""} />}
        
        />
        </div>
        </aside>
       
      <aside className="flex justify-around items-center flex-col w-2/6 h-full border-4 border-violet-800 rounded-2xl">
        <label htmlFor="featuredImage" className="bg-blue-600 py-5 px-8 text-xl font-semibold rounded-2xl text-gray-800 dark:text-white">Enter Blog's Featured Image Here</label>
        <Controller
        name="featuredImage"
        control={control}
        render={({ field }) => <UploadFileBtn {...field} value={field.value || ""} />}
        />
       
      </aside>
        </section> 
      <section className="flex justify-around flex-col ">
        <label htmlFor="content" className="bg-gray-800 dark:bg-slate-500 py-3 px-8 text-xl font-semibold rounded-2xl dark:text-zinc-800 text-violet-300 text-center">Let's Blog</label>
        <Controller
        name="content"
        control={control}
        render={({ field }) => <RTE {...field} value={field.value || ""} />}
      />
       
      </section>
      <div className="">
      <Button type="submit">Submit</Button>
        </div>  
    </form>
    
  )
}

export default PostForm