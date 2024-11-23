import SignInWithGoogle from "@/components/SignInWithGoogle";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to SocialApp</h1>
        <SignInWithGoogle />
      </div>
    </div>
  );
} 