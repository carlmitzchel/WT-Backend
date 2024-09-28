import { NextRequest, NextResponse } from "next/server";
import { openDb } from "@/app/lib/db";
import { authenticateRequest } from "@/app/utils/auth";

interface Comment {
  comment_id: string;
  commenter_name: string;
  comment_body: string;
}

export async function POST(request: NextRequest) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { post_id, commenter_name, comment_body } = await request.json();

    // Validate input
    if (!post_id || !commenter_name || !comment_body) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await openDb();

    const comment_id = `${post_id}%${commenter_name}`;

    // Create new comment
    await db.run(
      "INSERT INTO comments (comment_id, post_id, commenter_name, comment_body) VALUES (?, ?, ?, ?)",
      [comment_id, post_id, commenter_name, comment_body]
    );

    const newComment: Comment = {
      comment_id: comment_id,
      post_id,
      commenter_name,
      comment_body,
    };

    return NextResponse.json({
      post_id: post_id || null,
      comment: newComment || null,
    });
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
