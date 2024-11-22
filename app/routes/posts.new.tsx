import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect } from "@remix-run/react";
import {prisma} from "../../utils/db.server"

export const action = async ({ 
  request 
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof title !== "string" || typeof content !== "string") {
    return json({ error: "Title and content must be strings" }, { status: 400 });
  }

  if (!title || !content) {
    return {error: "Title and content are required!"};
  }

  await prisma.post.create({
    data: {title, content},
  });

  return redirect("/posts")

};

export default function NewPost() {
  return (
    <div>
      <h1 className="text-center font-bold text-[1.2rem]">Create a New Post</h1>
      <Form method="post" className="flex flex-col justify-center items-start w-[80%] mx-auto">
        <label className="flex flex-col w-[100%] mb-2">
          Title:
          <input className="focus:outline-none w-[100%] rounded-md bg-gray-100 p-4" type="text" name="title" placeholder="Enter title"/>
        </label>
        <label className="flex flex-col w-[100%]">
          Content:
          <textarea 
            className="focus:outline-none h-[10rem] bg-gray-100 p-4 rounded-md" 
            name="content"
            placeholder="Enter your content..."
          >
          </textarea>
        </label>
        <button 
          type="submit"
          className="bg-blue-500 mt-5 text-white px-5 py-3 rounded-md font-bold text-[1rem] hover:shadow-lg transition-all ease-in-out duration-150 cursor-pointer"
        >
          Create Post
        </button>
      </Form>
    </div>
  );
}
