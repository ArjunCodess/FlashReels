import SideNavigation from "@/components/dashboard/side-navigation";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard - Flash Reels",
  description:
    "Flash Reels allows users to create AI-generated videos, reels, and shorts instantly with just one click. Unlock creativity with speed and innovation.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <section className="max-w-7xl mx-auto pt-2 pb-4">
      <div className="flex md:min-h-[calc(100vh-120px)]">
        <div className="hidden md:block bg-background w-72 border rounded-md">
          <SideNavigation />
        </div>
        <div className="flex-1 md:ml-4 border rounded-md">{children}</div>
      </div>
    </section>
  );
}