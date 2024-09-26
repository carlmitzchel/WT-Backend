import axios from "axios";
import Cookies from "js-cookie";

export interface Comment {
  comment_id: number;
  post_id: number;
  commenter_name: string;
  comment_body: string;
}

export interface Post {
  post_id: number;
  title: string;
  content: string;
  comments: Comment[];
}

const api = axios.create({
  baseURL: "/api",
});

export const getPosts = async (): Promise<Post[]> => {
  const apiKey = Cookies.get("apiKey");
  if (!apiKey) {
    throw new Error("No API key found. Please log in.");
  }
  try {
    const response = await api.get<{ posts: Post[] }>("/posts", {
      headers: {
        "X-API-Token": "apiKey",
        "Content-Type": "application/json",
      },
    });
    console.log("Posts fetched:", response.data.posts);
    return response.data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      Cookies.remove("apiKey");
      throw new Error("Authentication failed. Please log in again.");
    }
    throw error;
  }
};
