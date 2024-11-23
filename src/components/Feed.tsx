"use client";

import { useEffect, useState } from "react";
import { getFeedPosts } from "@/lib/firebase/firebaseUtils";
import { Post as PostType } from "@/lib/types";
import PostCard from "./PostCard";
import LoadingSpinner from "./ui/LoadingSpinner";

export default function Feed() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const feedPosts = await getFeedPosts();
        setPosts(feedPosts);
      } catch (error) {
        console.error("Error loading feed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onPostUpdate={(updatedPost) => {
          setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
        }} />
      ))}
    </div>
  );
} 