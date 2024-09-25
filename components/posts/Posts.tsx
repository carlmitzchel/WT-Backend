"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Adjust the import path as necessary
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

interface Post {
  post_id: number;
  title: string;
  content: string;
}

interface Comment {
  comment_id: string;
  commenter_name: string;
  comment_body: string;
}

const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts");
        setPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch posts");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24 mt-2" />
        <Skeleton className="w-full h-24 mt-2" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.post_id} className="shadow-md">
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{post.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostsList;
