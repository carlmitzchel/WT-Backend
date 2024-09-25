import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateApiKey } from "../api/login/route";
import PostsList from "@/components/posts/Posts";

export default function DashboardPage() {
  const cookieStore = cookies();
  const apiKey = cookieStore.get("apiKey")?.value;

  if (!apiKey || !validateApiKey(apiKey)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <PostsList />
    </div>
  );
}
