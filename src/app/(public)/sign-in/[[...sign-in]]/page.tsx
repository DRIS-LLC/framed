import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col h-full min-h-screen justify-center items-center gap-2">
      <SignIn />
    </div>
  );
}
