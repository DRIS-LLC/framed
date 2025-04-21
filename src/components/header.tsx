"use client";

import { Button as DrisButton } from "@/components/dris/button";
import { Button } from "@/components/ui/button";
import config from "@/constants/config";
import { useClerk, useUser } from "@clerk/nextjs";
import { CableIcon, LogOutIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="flex absolute top-0 left-0 w-full py-6 px-8" id="top">
      <div className="flex w-full mx-auto max-w-6xl justify-between items-center">
        <Link href="/" className="text-2xl font-semibold flex gap-3 items-center">
          <Image src="/assets/images/icon.svg" alt="Walker Icon" width={36} height={36} />
          {config.SITE_NAME}
        </Link>

        <div className="flex items-center gap-3">
          {isLoaded &&
            (isSignedIn ? (
              <>
                <DrisButton variant="lilac" rounded="md" onClick={handleSignOut}>
                  Sign Out
                  <LogOutIcon />
                </DrisButton>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Link href="/sign-up" tabIndex={-1}>
                  <DrisButton variant="lilac" rounded="md">
                    Get Started
                    <CableIcon />
                  </DrisButton>
                </Link>
              </>
            ))}
        </div>
      </div>
    </header>
  );
}
