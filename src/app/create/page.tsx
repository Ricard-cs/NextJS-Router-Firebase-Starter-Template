"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { createPost, uploadFile } from "@/lib/firebase/firebaseUtils";
import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";

export default function CreatePostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const path = `posts/${user.uid}/${Date.now()}-${imageFile.name}`;
        imageUrl = await uploadFile(imageFile, path);
      }

      await createPost({
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userImage: user.photoURL || "",
        content: content.trim(),
        imageUrl,
        createdAt: Date.now(),
        likes: [],
        comments: []
      });

      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {imagePreview && (
          <div className="relative w-full h-64">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <ImagePlus size={20} />
            Add Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading && <Loader2 size={20} className="animate-spin" />}
            Post
          </button>
        </div>
      </form>
    </div>
  );
} 