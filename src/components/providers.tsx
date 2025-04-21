import { SearchProvider } from "@/providers/search";
import SuspenseWrapper from "@/providers/suspense-wrapper";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#C27BFF" },
      }}
    >
      <SearchProvider>
        <SuspenseWrapper>{children}</SuspenseWrapper>
      </SearchProvider>
    </ClerkProvider>
  );
}
