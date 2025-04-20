import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-col h-full min-h-screen justify-center items-center gap-2">
      <SignUp />
    </div>
  );
}
