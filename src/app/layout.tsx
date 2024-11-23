import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { ToasterProvider } from "@/components/ui/Toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToasterProvider>
            <main className="min-h-screen bg-gray-50">
              {children}
              <Navigation />
            </main>
          </ToasterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
