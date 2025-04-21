"use client";

import Image from "next/image";
import { Suspense } from "react";

export default function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={<Image src="/assets/images/icon.svg" alt="Loading" width={40} height={40} className="animate-pulse" />}
    >
      {children}
    </Suspense>
  );
}
