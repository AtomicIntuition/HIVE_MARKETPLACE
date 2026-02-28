import { Suspense } from "react";
import { SignUpForm } from "./signup-form";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>}>
      <SignUpForm />
    </Suspense>
  );
}
