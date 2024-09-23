import { openDb } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "../../login/route";
import { comment } from "postcss";

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

export async function DELETE(
  request: NextRequest,
  { params }: { comment_id: string }
) {
  const apiKey = request.headers.get("X-API-Token");
  if (!apiKey || !validateApiKey(apiKey)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const comment_id = params.comment_id;

    const db = await openDb();

    const comment = (await db.get(
      "SELECT * FROM comments WHERE comment_id = ?",
      comment_id
    )) as Comment | undefined;

    if (!comment) {
      return NextResponse.json({ success: false });
    }

    // Delete the comment
    await db.run("DELETE FROM comments WHERE comment_id = ?", comment_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { comment_id: string } }
) {
  const apiKey = request.headers.get("X-API-Token");
  if (!apiKey || !validateApiKey(apiKey)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const comment_id = params.comment_id;

    const db = await openDb();

    const comment = (await db.get(
      "SELECT * FROM comments WHERE comment_id = ?",
      comment_id
    )) as Comment | undefined;

    if (!comment) {
      return NextResponse.json({ comment: null });
    }

    const { commenter_name, comment_body } = await request.json();

    // Update a post
    const result = await db.run(
      "UPDATE comments SET commenter_name = ?, comment_body = ? WHERE comment_id = ?",
      [commenter_name, comment_body, comment_id]
    );

    const updatedComment: Comment = {
      comment_id,
      commenter_name,
      comment_body,
    };

    return NextResponse.json(
      { success: true, comment: updatedComment },
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
