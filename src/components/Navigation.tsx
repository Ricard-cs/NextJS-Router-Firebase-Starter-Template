"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, PlusSquare } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const tabs = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/create", icon: PlusSquare, label: "Create" },
    { href: `/profile/${user.uid}`, icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center p-2 ${
                isActive ? "text-blue-500" : "text-gray-500"
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 