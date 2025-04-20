"use client";

import { createContext, useContext, useEffect, useState } from "react";

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedQuery = localStorage.getItem("search");
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      localStorage.setItem("search", searchQuery);
    }
  }, [searchQuery]);

  return <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
