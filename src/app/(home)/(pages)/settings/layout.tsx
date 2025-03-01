import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

async function SettingsLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) redirect("/");
  
  return <>{children}</>;
}

export default SettingsLayout;
