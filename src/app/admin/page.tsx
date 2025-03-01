import Logo from "@/components/navbar/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { PiBell, PiGear } from "react-icons/pi";
import PendingProducts from "./PendingProduct";
import { auth } from "@/auth";
import {
  getActiveProducts,
  getAdminData,
  getPendingProducts,
  getRejectedProducts,
  getTotalUpvotes,
  getUsers,
} from "@/lib/actions/productAction";
import OverviewChart from "@/components/OverViewChart";
import RecentActivity from "@/components/RecentActivity";

const AdminPage = async () => {
  const session = await auth();
  const user = await session?.user;
  const users = await getUsers();
  const activeProducts = await getActiveProducts();
  const rejectedProducts = await getRejectedProducts();
  const totalUpvotes = await getTotalUpvotes();
  const data = await getAdminData();
  const premiumUsers = users.filter((user) => user.isPremium);

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
            <CardContent>{users.length}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">Premium Users</CardTitle>{" "}
              💰
            </CardHeader>
            <CardContent>{premiumUsers.length}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">
                Active Products
              </CardTitle>{" "}
              📦
            </CardHeader>
            <CardContent>{activeProducts.length}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">
                Pending Products
              </CardTitle>{" "}
              🕒
            </CardHeader>
            <CardContent>{pendingProducts.length}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">
                Rejected Products
              </CardTitle>
              👤
            </CardHeader>
            <CardContent>{rejectedProducts.length}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">Upvotes</CardTitle> 🔺
            </CardHeader>
            <CardContent>{totalUpvotes}</CardContent>
          </Card>
        </div>

        <div className="my-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="pb-10">Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <OverviewChart data={data} />
            </CardContent>
          </Card>

          <Card className="col-span-4 w-full md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>View recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity users={users} />
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10" />

        <div className="space-y-10 pb-10">
          <h1 className="text-2xl font-bold">Pending Products</h1>
          <PendingProducts
            pendingProducts={pendingProducts}
            authenticatedUser={user}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
