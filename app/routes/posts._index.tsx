import { 
  Link, 
  useLoaderData 
} from "@remix-run/react";
import { 
  LoaderFunction, 
  json 
} from "@remix-run/node"

import {prisma} from "../../utils/db.server"
import { Post } from "../../utils/types";

// Loader
export const loader: LoaderFunction = async () => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc"},
  });
  
  return json(posts)
}

//  UI
export default function Posts() {

  const posts: Post[] = useLoaderData();

  return (
    <div className="w-[80%] mx-auto">
      <h2 className="text-center py-5 font-bold text-[1.2rem]">All Blog Posts</h2>
      <ul>  
        {posts?.map(post => (
          <li 
            key={post.id}
            className="border-black border-2 p-5 my-5 hover:shadow-lg rounded-md transition-all ease-in-out duration-150 cursor-pointer"
          >
            <Link to={`/posts/${post.id}`}>
              <p className="font-bold text-[1.1rem]">{post.title}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Link to={`/posts/new`}>
        <button className="bg-blue-500 mt-5 text-white px-5 py-3 rounded-md font-bold text-[1.1rem] hover:shadow-lg transition-all ease-in-out duration-150 cursor-pointer">
          Create A New Post
        </button>
      </Link>
    </div>
  )
}; 