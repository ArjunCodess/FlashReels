'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import ThemeToggler from '@/components/theme-toggler'

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)

    const MenuItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
        <Link href={href} className="block hover:bg-accent cursor-pointer" onClick={toggleMenu}>
            {children}
        </Link>
    )

    return (
        <header className="shadow-sm border rounded-md px-6 my-2 max-w-7xl mx-auto">
            <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center">
                    <Image src="/logo.svg" width={30} height={30} alt="Flash Reels Logo" />
                    <h2 className="ml-2 text-xl font-bold">Flash Reels</h2>
                </Link>
                <div className="hidden md:flex items-center space-x-4">
                    <ThemeToggler />
                    <Button asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <UserButton afterSignOutUrl="/" />
                </div>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <nav className="flex flex-col gap-5">
                            <MenuItem href="/dashboard">Dashboard</MenuItem>
                            <ThemeToggler />
                            <UserButton />
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}