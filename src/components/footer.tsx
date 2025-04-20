import config from "@/constants/config";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex text-xs absolute bottom-0 w-full pb-6 text-foreground/80 md:px-0 px-6">
      <div className="w-full flex flex-col md:flex-row justify-between items-center max-w-xl mx-auto gap-2">
        <span className="inline-flex items-center gap-1">
          © {new Date().getFullYear()} {config.SITE_NAME} Inc.
        </span>

        <div className="flex justify-center items-center gap-2 opacity-80 underline">
          <Link href="/privacy-policy" target="_blank" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" target="_blank" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
