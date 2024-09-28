import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateApiKey } from "../api/login/route";
import Posts from "@/components/posts/Posts";

export default async function DashboardPage() {
  // const cookieStore = cookies();
  // const apiKey = cookieStore.get("apiKey")?.value;

  // if (!apiKey || !validateApiKey(apiKey)) {
  //   redirect("/");
  // }

  return (
    <main className="container mx-auto px-4 pt-8">
      <Posts />
    </main>
  );
}
