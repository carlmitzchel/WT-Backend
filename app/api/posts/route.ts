import { NextRequest, NextResponse } from "next/server";
import { openDb } from "@/app/lib/db";
import { authenticateRequest } from "@/app/utils/auth";
interface Comment {
  comment_id: string;
  commenter_name: string;
  comment_body: string;
}

interface Post {
  post_id: number;
  title: string;
  content: string;
  author_name: string;
  comments: Comment[];
}

export async function POST(request: NextRequest) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { title, content, author_name } = await request.json();

    // Validate input
    if (!title || !content || !author_name) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await openDb();

    // Create new post
    const result = await db.run(
      "INSERT INTO posts (title, content, author_name) VALUES (?, ?, ?)",
      [title, content, author_name]
    );

    const newPost: Post = {
      post_id: result.lastID,
      title,
      content,
      author_name,
      comments: [],
    };

    console.log(request.headers);
    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Authenticate request
  if (!(await authenticateRequest(request))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const db = await openDb();
    const posts = await db.all("SELECT * FROM posts");

    console.log("Fetching posts...");

    // Fetch comments for each post
    for (const post of posts) {
      post.comments = await db.all(
        "SELECT * FROM comments WHERE post_id = ?",
        post.post_id
      );
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
