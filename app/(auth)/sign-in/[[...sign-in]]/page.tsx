import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignInPage() {
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
                <SignIn />
            </div>
        </div>
    )
}