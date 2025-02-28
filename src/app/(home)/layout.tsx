import { ReactNode, Suspense } from "react";
import { auth } from "@/auth";
import Navbar from "@/components/navbar/Navbar";

import {
  getNotifications,
  getProductsByUserId,
} from "@/lib/actions/productAction";
import Spinner from "@/components/Spinner";

async function HomeLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const user = await session?.user;
  const notifications = await getNotifications();
  const products = await getProductsByUserId(user?.id);
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <Navbar user={user} notifications={notifications} products={products} />

        {children}
      </Suspense>
    </div>
  );
}

export default HomeLayout;
