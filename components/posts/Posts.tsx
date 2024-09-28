"use client";

import { useQuery } from "@tanstack/react-query";
import { getPosts, Post } from "@/services/api";
import { PacmanLoader } from "react-spinners";

export default function Posts() {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading)
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <PacmanLoader />
      </div>
    );
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {posts?.map((post) => (
        <div
          key={post.post_id}
          className="bg-slate-50 p-6 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
          <p className="mb-4">{post.content}</p>
          {/* TODO: COMMENTS INTEGRATIONS */}
          <div className="bg-slate-100 rounded-lg p-3">
            <h3 className="text-xl font-semibold mb-2 ">Comments:</h3>

            {post.comments.map((comment) => (
              <ul className="list-none gap-3" key={comment.comment_id}>
                <div className="py-2" key={comment.comment_id}>
                  <li className="bg-slate-200 rounded-lg">
                    <div className="flex flex-col p-3">
                      <h3 className="text-lg font-bold">
                        {comment.commenter_name}
                      </h3>
                      <p className="text-md">{comment.comment_body}</p>
                    </div>
                  </li>
                </div>
              </ul>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
