import { redirect } from "next/navigation";
import Feed from "@/components/Feed";
import { auth } from "@/lib/firebase/firebase";

export default async function Home() {
  // Server-side auth check
  const session = await auth.currentUser;
  if (!session) redirect("/auth");

  return (
    <div className="max-w-2xl mx-auto pb-20 pt-4">
      <Feed />
    </div>
  );
}
