"use client";

import { logout } from "@/server/auth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.push('/sign-in')
  }

  return (
    <Button onClick={handleLogout}>Logout</Button>
  );
};
