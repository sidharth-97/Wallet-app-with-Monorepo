"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Navbar } from "@repo/ui/navBar";
import { useRouter } from "next/navigation";

export function NavbarClient() {
  const session = useSession();
  const router = useRouter();

  return (
   <div>
      <Navbar onSignin={signIn} onSignout={async () => {
        await signOut()
        router.push("/api/auth/signin")
      }} user={session.data?.user} />
   </div>
  );
}
