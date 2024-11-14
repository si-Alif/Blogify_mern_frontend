import { useForm, Controller } from "react-hook-form";
import { Tags, Input, UploadFileBtn, PostStatus, Button } from "../utils/utilsIndex.js";
import RTE from "./RTE.jsx";
import databaseService from "../Appwrite/DB.js";
import storageService from "../Appwrite/Storage.js";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../Appwrite/auth.js";

const PostForm = () => {
  const location = useLocation();
  const post = location.state
  console.log(post)
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userInfo);
  console.log(userData);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: post?.title || "",
      tags: post?.tags || [],
      featuredImage: post?.featuredImage || "",
      content: post?.content || "",
      status: post?.status || "",
    },
  });

  const onSubmit = async (data) => {
    const user = await authService.getCurrUserData("current");

    if (post && post.tags?.length > 0) {
      const file = post.featuredImage ? post.featuredImage : null
      console.log(file)
      if (file != data.featuredImage) {
        try {
          if(file){

            await storageService.deleteFile(file);
          }

          const newFileId = await storageService.uploadFile(data.featuredImage);
          const fileId = newFileId.$id
          data.featuredImage = fileId;
          const dbPost = await databaseService.updatePost(post.$id,{
            ...data,
            userId: userData.userId,
            createdBy: user.name,
            
          });
          if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
          }
        } catch (error) {
          throw new Error(
            `Failed to delete file with id ${post.featuredImage} from the Appwrite server: ${error.message}`
          );
        }
      }
    } else {
      const file = data.featuredImage
        ? await storageService.uploadFile(data.featuredImage)
        : null;
      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        const dbPost = await databaseService.createPost({
          ...data,
          userId: userData.userId,
          createdBy: user.name,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="my-10 flex flex-col items-center gap-[5vh]"
    >
      <section className="w-screen h-[50vh] flex flex-row justify-evenly items-center">
        <aside className="w-3/5 h-full flex flex-col justify-evenly items-center">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="w-[55vw] p-7 bg-red-200 rounded-xl"
                label="Enter Post Title"
                type="text"
                required
                icon
              />
            )}
          />
          <div className="w-full h-4/6 flex flex-row justify-around items-center">
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Tags
                  {...field}
                  vals={["React", "JavaScript", "CSS", "HTML", "Node.js", "MongoDB"]}
                  value={field.value || []}
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <PostStatus {...field} value={field.value || ""} />
              )}
            />
          </div>
        </aside>

        <aside className="flex justify-around items-center flex-col w-2/6 h-full border-4 border-violet-800 rounded-2xl">
          <label
            htmlFor="featuredImage"
            className="bg-blue-600 py-5 px-8 text-xl font-semibold rounded-2xl text-gray-800 dark:text-white"
          >
            Enter Blog's Featured Image Here
          </label>
          <Controller
            name="featuredImage"
            control={control}
            render={({ field }) => (
              <UploadFileBtn {...field} value={field.value || ""}  onChange={(file) => field.onChange(file)} />
            )}
          />
        </aside>
      </section>
      <section className="flex justify-around flex-col ">
        <label
          htmlFor="content"
          className="bg-gray-800 dark:bg-slate-500 py-3 px-8 text-xl font-semibold rounded-2xl dark:text-zinc-800 text-violet-300 text-center"
        >
          Let's Blog
        </label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => <RTE {...field} value={field.value || ""} />}
        />
      </section>
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default PostForm;
