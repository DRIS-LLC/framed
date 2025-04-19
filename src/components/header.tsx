import { Button } from "@/components/ui/button";
import config from "@/constants/config";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex absolute top-0 left-0 w-full py-6 px-0 md:px-10" id="top">
      <div className="flex w-full mx-auto max-w-6xl justify-between items-center ">
        <Link href="/" className="font-bold text-2xl flex gap-3 items-center">
          <Image src="/assets/images/icon-2.svg" alt="Framed Icon" width={28} height={28} />
          {config.SITE_NAME}
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
