"use client";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <Link href="/" className="font-bold text-xl">
          Wealth AI
        </Link>
        <nav className="flex items-center space-x-4">
          <SignedIn>
            {/* The User button displays the profile */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            {/* The Sign In button */}
            <Button asChild>
              <SignInButton />
            </Button>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}