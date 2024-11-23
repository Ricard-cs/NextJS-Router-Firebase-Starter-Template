import { getUserProfile, getUserPosts } from "@/lib/firebase/firebaseUtils";
import { auth } from "@/lib/firebase/firebase";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/ProfileHeader";
import PostCard from "@/components/PostCard";

export default async function ProfilePage({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const session = await auth.currentUser;
  if (!session) redirect("/auth");

  const [profile, posts] = await Promise.all([
    getUserProfile(userId),
    getUserPosts(userId),
  ]);

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <ProfileHeader profile={profile} isOwner={session.uid === userId} />
      <div className="space-y-4 mt-6 px-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPostUpdate={() => {}} // Profile posts are static, no need for updates
          />
        ))}
      </div>
    </div>
  );
} 