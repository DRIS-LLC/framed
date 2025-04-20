"use client";

import { Container } from "@/components/container";
import { Button as DrisButton } from "@/components/dris/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSearch } from "@/providers/search";
import { Loader2, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const { searchQuery } = useSearch();
  const [isSearching, setIsSearching] = useState(false);

  const router = useRouter();

  const handleSearch = async () => {
    setIsSearching(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      router.push("/");
    }

    handleSearch();
  }, [searchQuery]);

  return (
    <Container>
      <div className="w-full relative">
        <Textarea
          className="w-full p-5 resize-none h-36 bg-background/50 backdrop-blur-sm no-scrollbar overflow-auto disabled:opacity-50"
          required
        >
          {searchQuery}
        </Textarea>
        <div className={cn("absolute bottom-4 right-4")}>
          <DrisButton size="icon" variant="lilac" rounded="lg" type="submit" disabled={isSearching}>
            {isSearching ? <Loader2 className="animate-spin" /> : <XIcon />}
          </DrisButton>
        </div>
      </div>
    </Container>
  );
}
