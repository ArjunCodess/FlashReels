import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const { userId } = auth();

  if (userId) redirect("/dashboard");

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 relative hidden lg:block">
        <Image
          src="/auth.jpg"
          alt="Creative reels composition"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <SignUp />
      </div>
    </div>
  );
}
