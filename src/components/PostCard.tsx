"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Post, Comment } from "@/lib/types";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { updateDocument } from "@/lib/firebase/firebaseUtils";
import CommentSection from "./CommentSection";
import Link from "next/link";

interface PostCardProps {
  post: Post;
  onPostUpdate: (post: Post) => void;
}

export default function PostCard({ post, onPostUpdate }: PostCardProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?.uid || ""));

  const handleLike = async () => {
    if (!user) return;

    const newLikes = isLiked
      ? post.likes.filter(id => id !== user.uid)
      : [...post.likes, user.uid];

    const updatedPost = { ...post, likes: newLikes };
    await updateDocument("posts", post.id, { likes: newLikes });
    onPostUpdate(updatedPost);
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Post Header */}
      <div className="flex items-center mb-4">
        <Link href={`/profile/${post.userId}`}>
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={post.userImage || "https://placehold.co/100x100"}
              alt={post.userName}
              fill
              className="object-cover"
            />
          </div>
        </Link>
        <div className="ml-3">
          <Link href={`/profile/${post.userId}`}>
            <h3 className="font-semibold">{post.userName}</h3>
          </Link>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="mb-4">{post.content}</p>
      {post.imageUrl && (
        <div className="relative w-full h-64 mb-4">
          <Image
            src={post.imageUrl}
            alt="Post image"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center gap-6 border-t pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          <span>{post.likes.length}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-gray-500"
        >
          <MessageCircle size={20} />
          <span>{post.comments.length}</span>
        </button>
        <button className="flex items-center gap-1 text-gray-500">
          <Share2 size={20} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          comments={post.comments}
          onCommentAdded={(newComment) => {
            const updatedPost = {
              ...post,
              comments: [...post.comments, newComment],
            };
            onPostUpdate(updatedPost);
          }}
        />
      )}
    </div>
  );
} 