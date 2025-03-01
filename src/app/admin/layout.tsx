import { getCurrentUser } from "@/lib/actions/productAction";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const currentUser = await getCurrentUser();
  console.log(currentUser.role);
  if (currentUser.role !== "ADMIN") return redirect("/");

  return <>{children}</>;
}

export default AdminDashboardLayout;
