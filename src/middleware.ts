import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/onboarding(.*)", "/search(.*)"]);
const VALID_SUBDOMAINS = ["vanderbilt", "nyu", "wharton"];

function getSubdomain(host: string): string | null {
  if (host && host.includes(".")) {
    const candidate = host.split(".")[0];
    if (candidate && !candidate.includes("localhost")) {
      return candidate;
    }
  }
  return null;
}

export default clerkMiddleware(async (auth, req) => {
  const { nextUrl, headers } = req;
  const host = headers.get("host");
  const subdomain = host ? getSubdomain(host) : null;

  if (subdomain) {
    if (!VALID_SUBDOMAINS.includes(subdomain)) {
      const mainDomain = host?.replace(`${subdomain}.`, "") || "";
      return NextResponse.redirect(new URL(`https://${mainDomain}${nextUrl.pathname}${nextUrl.search}`));
    }

    const response = NextResponse.next();
    response.cookies.set("currentSchool", subdomain, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    req.headers.set("x-subdomain", subdomain);
  }

  if (isProtectedRoute(req)) await auth.protect();

  const { userId } = await auth();

  if (userId) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    const linkedinUrl = user.unsafeMetadata.linkedinProfileUrl;

    if (!linkedinUrl && !req.url.includes("/onboarding")) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
