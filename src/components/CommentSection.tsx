"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Comment } from "@/lib/types";
import { updateDocument } from "@/lib/firebase/firebaseUtils";
import Image from "next/image";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: (comment: Comment) => void;
}

export default function CommentSection({
  postId,
  comments,
  onCommentAdded,
}: CommentSectionProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      userImage: user.photoURL || "",
      content: content.trim(),
      createdAt: Date.now(),
    };

    await updateDocument("posts", postId, {
      comments: [...comments, newComment],
    });

    onCommentAdded(newComment);
    setContent("");
  };

  return (
    <div className="mt-4 border-t pt-4">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!content.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50"
        >
          Post
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={comment.userImage || "https://placehold.co/100x100"}
                alt={comment.userName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg p-2">
              <p className="font-semibold text-sm">{comment.userName}</p>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 