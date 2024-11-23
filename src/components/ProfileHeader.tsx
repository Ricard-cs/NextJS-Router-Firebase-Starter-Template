"use client";

import { useState } from "react";
import Image from "next/image";
import { UserProfile } from "@/lib/types";
import { uploadFile, updateDocument } from "@/lib/firebase/firebaseUtils";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwner: boolean;
}

export default function ProfileHeader({ profile, isOwner }: ProfileHeaderProps) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio || "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    try {
      const path = `profiles/${user.uid}/${Date.now()}-${file.name}`;
      const imageUrl = await uploadFile(file, path);
      await updateDocument("profiles", profile.id, { imageUrl });
      window.location.reload(); // Refresh to see changes
    } catch (error) {
      console.error("Error updating profile image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await updateDocument("profiles", profile.id, {
        name: name.trim(),
        bio: bio.trim(),
      });
      setEditing(false);
      window.location.reload(); // Refresh to see changes
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow">
      <div className="relative h-32 bg-blue-500">
        <div className="absolute -bottom-16 left-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
            <Image
              src={profile.imageUrl || "https://placehold.co/200x200"}
              alt={profile.name}
              fill
              className="object-cover"
            />
            {isOwner && (
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer">
                <Camera className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="pt-20 px-4 pb-4">
        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Write your bio..."
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-gray-600 mt-1">{profile.bio}</p>
              </div>
              {isOwner && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 border rounded"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 