import ThemeToggler from "@/components/theme-toggler";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <UserButton />
      <ThemeToggler />
    </div>
  );
}