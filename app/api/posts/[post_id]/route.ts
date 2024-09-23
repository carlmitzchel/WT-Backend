import { openDb } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "../../login/route";

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { post_id: string } }
) {
  const apiKey = request.headers.get("X-API-Token");
  if (!apiKey || !validateApiKey(apiKey)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const post_id = parseInt(params.post_id);

    const db = await openDb();

    const post = (await db.get(
      "SELECT * FROM posts WHERE post_id = ?",
      post_id
    )) as Post | undefined;

    if (!post) {
      return NextResponse.json({ post: null });
    }

    const { title, content, author_name } = await request.json();

    // Update a post
    const result = await db.run(
      "UPDATE posts SET title = ?, content = ?, author_name = ? WHERE post_id = ?",
      [title, content, author_name, post_id]
    );

    const updatedPost: Post = {
      post_id: result.lastID,
      title,
      content,
      author_name,
      comments: [],
    };

    return NextResponse.json(
      { success: true, post: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { post_id: string } }
) {
  try {
    const post_id = parseInt(params.post_id);

    const db = await openDb();

    // Fetch the post
    const post = (await db.get(
      "SELECT * FROM posts WHERE post_id = ?",
      post_id
    )) as Post | undefined;

    if (!post) {
      return NextResponse.json({ post: null });
    }

    // Fetch comments for the post

    const comments = (await db.all(
      "SELECT * FROM comments WHERE post_id = ?",
      post_id
    )) as Comment[];

    // Add comments to the post
    post.comments = comments;

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
