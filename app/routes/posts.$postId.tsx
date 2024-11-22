import { 
  ActionFunctionArgs,
  LoaderFunctionArgs, 
  json 
} from "@remix-run/node"

import {prisma} from "../../utils/db.server"
import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import { Post } from "utils/types";

// Loader
export const loader = async ({
  params
}: LoaderFunctionArgs) => {
  const post = await prisma.post.findUnique({
    where: {id: Number(params.postId)}
  });

  if (!post) {
    throw new Response("Post not Found", {status: 404})
  };

  return json(post);
}

// Action
export const action = async ({
  request,
  params
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const method = formData.get("_method")

  if (method === "delete") {
    await prisma.post.delete({
      where: {id: Number(params.postId)},
    });

    return redirect("/posts")
  }

  return json({error: "Invalid Method"}, {status: 404})
}

// UI
export default function PostDetail() {

  const post: Post = useLoaderData();

  return (
    <div className="w-[60%] mx-auto p-5 flex flex-col justify-center items-center">
      <Link to={`/posts`}>
          <button
            className="bg-blue-500 mt-2 text-white px-5 py-3 rounded-md font-bold text-[1rem] hover:shadow-lg transition-all ease-in-out duration-150 cursor-pointer"
          >
            Posts
          </button>
        </Link>
      <h1 className="font-bold text-[1.2rem] my-8">{post.title}</h1>
      <p className="mb-[5rem]">{post.content}</p>

      <div className="flex gap-2 ]">
        <Link to={`/posts/${post.id}/edit`}>
          <button
            className="bg-blue-500  text-white px-5 py-3 rounded-md font-bold text-[1rem] hover:shadow-lg transition-all ease-in-out duration-150 cursor-pointer"
          >
            Edit
          </button>
        </Link>

        <Form method="post">
          <input type="hidden" name="_method" value="delete" />
          <button 
            type="submit"
            className="bg-red-500  text-white px-5 py-3 rounded-md font-bold text-[1rem] hover:shadow-lg transition-all ease-in-out duration-150 cursor-pointer"
          >
            Delete
          </button>
        </Form>
      </div>
    </div>
  )
}