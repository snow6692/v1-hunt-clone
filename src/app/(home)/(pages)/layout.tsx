import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

async function PagesLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const user = await session?.user;

  if (!user) {
    redirect("/");
  }
  return (
    <div>
      {children}
      <Toaster position="top-center" />
    </div>
  );
}

export default PagesLayout;
