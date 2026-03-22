"use client";

import { Shield } from "lucide-react";
import { AuthShell } from "@/components/admin/auth-shell";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function AdminLogin() {
  return (
    <AuthShell icon={Shield} title="Moltzart Admin" subtitle="Sign in with your Google account to continue.">
      <Button onClick={() => signIn("google")} className="w-full">
        Sign in with Google
      </Button>
    </AuthShell>
  );
}
