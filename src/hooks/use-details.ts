import { useSession, useUser } from "@clerk/nextjs";

export function useDetails() {
  const { user } = useUser();
  const { session } = useSession();

  if (!user || !session) return null;

  return {
    user,
    session,
  };
}

export function useIsAuthenticated() {
  const { user } = useUser();
  return !!user;
}
