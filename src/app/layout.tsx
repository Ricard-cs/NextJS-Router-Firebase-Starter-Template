import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/Toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <main className="min-h-screen bg-gray-50">
            {children}
            <Navigation />
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
