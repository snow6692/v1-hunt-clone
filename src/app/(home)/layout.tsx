import { ReactNode } from "react";
import { auth } from "@/auth";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "sonner";
import { getNotifications } from "@/lib/actions/productAction";

async function HomeLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const user = await session?.user;
  const notifications = await getNotifications();
  return (
    <div>
      <Navbar user={user} notifications={notifications} />
      {children}
      <Toaster position="top-center" />
    </div>
  );
}

export default HomeLayout;
