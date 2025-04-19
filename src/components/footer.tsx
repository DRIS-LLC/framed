import config from "@/constants/config";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex text-xs absolute bottom-0 w-full py-3.5 text-gray-600 border-t border-gray-200 bg-gray-100 md:px-0 px-6">
      <div className="w-full flex justify-between items-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1">
          © {new Date().getFullYear()} {config.SITE_NAME}
        </span>

        <div className="flex justify-center items-center gap-2">
          <Link href="/privacy-policy" target="_blank" className="underline">
            Privacy
          </Link>
          <Link href="/terms-of-service" target="_blank" className="underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
