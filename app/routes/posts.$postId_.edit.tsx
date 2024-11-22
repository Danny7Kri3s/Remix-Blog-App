import { 
  ActionFunctionArgs,
  LoaderFunctionArgs, 
  json 
} from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";

import {prisma} from "../../utils/db.server"
import { Post } from "utils/types";

// Loader
export const loader = async ({
  params
}: LoaderFunctionArgs) => {
  const post = await prisma.post.findUnique({
    where: {id: Number(params.postId)}
  });

  if (!post) {
    throw new Response("Post Not Found", {status: 404})
  }

  return json(post)
};

// action
export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof title !== "string" || typeof content !== "string") {
    return json({ error: "Title and content must be strings" }, { status: 400 });
  }

  if (!title || !content) {
    return { error: "Title and content are required." };
  }

  await prisma.post.update({
    where: { id: Number(params.postId) },
    data: { title, content },
  });

  return redirect(`/posts/${params.postId}`);
}

// UI
export default function PostEdit() {

  const post: Post = useLoaderData();

  return (
    <div>
      <h1 className="text-center font-bold text-[1.2rem]">Edit Post</h1>
      <Form method="post" className="flex flex-col justify-center items-start w-[80%] mx-auto">
        <label className="flex flex-col w-[100%] mb-2">
          Title:
          <input className="focus:outline-none w-[100%] rounded-md bg-gray-100 p-4" type="text" name="title" defaultValue={post.title} />
        </label>

        <label className="flex flex-col w-[100%]">
          Content:
          <textarea 
            name="content"
            className="focus:outline-none h-[10rem] bg-gray-100 p-4 rounded-md"
          >{post.content}
          </textarea>
        </label>
        <button 
          type="submit"
          className="bg-blue-500 mt-5 text-white px-5 py-3 rounded-md font-bold text-[1rem] hover:shadow-lg transition-all ease-in-out duration-150 cursor-pointer" 
        >
          Save Changes
        </button>
      </Form>
    </div>
  );
};