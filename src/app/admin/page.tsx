import Logo from "@/components/navbar/Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { PiBell, PiGear } from "react-icons/pi";
import PendingProducts from "./PendingProduct";
import { auth } from "@/auth";
import { getPendingProducts } from "@/lib/actions/productAction";

const Admin = async () => {
  const session = await auth();
  const user = await session?.user;

  const pendingProducts = await getPendingProducts();
  console.log(pendingProducts);
  return (
    <div className="px-8 md:px-20">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-6 py-10">
            <Logo />

            <div className="hidden md:block">
              <h1 className="text-3xl font-bold">Welcome back admin</h1>
              <p className="text-gray-500">
                Here is what&apos;s happening in your business today
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <PiBell className="text-2xl text-gray-500" />
            <PiGear className="text-2xl text-gray-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">Users</CardTitle>👤
            </CardHeader>
            <CardContent>0</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">Premium Users</CardTitle>{" "}
              💰
            </CardHeader>
            <CardContent>0</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">
                Active Products
              </CardTitle>{" "}
              📦
            </CardHeader>
            <CardContent>0</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">
                Pending Products
              </CardTitle>
              🕒
            </CardHeader>
            <CardContent>0</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">
                Rejected Products
              </CardTitle>
              👤
            </CardHeader>
            <CardContent>0</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">Upvotes</CardTitle> 🔺
            </CardHeader>
            <CardContent>0</CardContent>
          </Card>
        </div>

        <Separator className="my-10" />
        <div className="space-y-10 pb-10">
          <h1 className="text-2xl font-bold">Pending Products</h1>
          <PendingProducts
            authenticatedUser={user}
            pendingProducts={pendingProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;
