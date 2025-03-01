import { auth } from "@/auth";
import Navbar from "@/components/navbar/Navbar";
import {
  getNotifications,
  getProductsByUserId,
  isUserPremium,
} from "@/lib/actions/productAction";

import { redirect } from "next/navigation";

const NewProductLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  const user = await session?.user;

  const notifications = await getNotifications();

  const products = await getProductsByUserId(user?.id || "");

  const isPremium = await isUserPremium();

  if (!isPremium && products.length === 2) {
    redirect("/");
  }

  if (!user) {
    redirect("/");
  }

  return (
    <html lang="en">
      <body>
        <Navbar user={user} products={products} notifications={notifications} />

        {children}
      </body>
    </html>
  );
};

export default NewProductLayout;
