import { ReactNode } from "react";
import { auth } from "@/auth";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "sonner";

async function HomeLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const user = await session?.user;
  return (
    <div>
      <Navbar user={user} />
      {children}
      <Toaster position="top-center" />
    </div>
  );
}

export default HomeLayout;
