"use client";

import { CircleUser, FileVideo, PanelsTopLeft, Heart, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SideNavigation() {
  const pathname = usePathname();

  const options = [
    { id: 1, name: "Dashboard", path: "/dashboard", icon: PanelsTopLeft },
    { id: 2, name: "Create New", path: "/create-new", icon: FileVideo },
    { id: 3, name: "Favourites", path: "/favourites", icon: Heart },
    { id: 4, name: "Community", path: "/community", icon: Users },
    { id: 5, name: "Account", path: "/account", icon: CircleUser },
  ];

  return (
    <nav className="h-[80vh] md:h-[60vh] shadow-md p-5 flex flex-col">
      <ul className="space-y-2">
        {options.map((option) => (
          <li key={option.id}>
            <Link
              href={option.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                pathname === option.path
                  ? "bg-primary text-primary-foreground"
                  : "dark:hover:bg-neutral-900 hover:bg-neutral-100"
              )}
            >
              <option.icon className="w-5 h-5" />
              <span>{option.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
