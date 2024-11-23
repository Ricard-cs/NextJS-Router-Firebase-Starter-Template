"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ui/Toaster";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SignInWithGoogle() {
  const { signInWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      showToast("Successfully signed in!", "success");
    } catch (error) {
      console.error("Sign in error:", error);
      showToast("Failed to sign in. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-lg shadow hover:shadow-md transition-shadow disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <img src="/google.svg" alt="Google" className="w-5 h-5" />
      )}
      Sign in with Google
    </button>
  );
}
