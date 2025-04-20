import Providers from "@/components/providers";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import Image from "next/image";
import Footer from "../components/footer";
import Header from "../components/header";
import config from "../constants/config";
import "./globals.css";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: config.SITE_NAME,
    template: "%s | " + config.SITE_NAME,
  },
  description: config.SITE_DESCRIPTION,
  keywords: ["framed", "digital fingerprinting", "networking"],
  robots: "index, follow",
  metadataBase: new URL(config.SITE_URL),
  openGraph: {
    title: config.SITE_NAME,
    description: config.SITE_DESCRIPTION,
    url: config.SITE_URL,
    siteName: config.SITE_NAME,
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: config.SITE_NAME,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: config.SITE_NAME,
    description: config.SITE_DESCRIPTION,
    images: ["/assets/og-image.png"],
  },
};

export const runtime = "edge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable} antialiased`}>
        <body className="font-inter dark bg-background text-foreground relative w-full min-h-screen tracking-tight">
          <Header />
          <main className="flex flex-col w-full h-full max-w-xl mx-auto justify-start px-6 md:px-0">{children}</main>
          <Footer />
          <Image
            src="/assets/images/background.png"
            alt="Background"
            width={1000}
            height={1000}
            className="absolute blur-sm top-12 left-0 w-full h-full z-[-1] opacity-20 object-cover overflow-hidden"
          />
        </body>
      </html>
    </Providers>
  );
}
