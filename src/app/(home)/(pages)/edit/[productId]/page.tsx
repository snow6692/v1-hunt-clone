import { Badge } from "@/components/ui/badge";
import { getProductById, getRankById } from "@/lib/actions/productAction";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PiArrowLeft } from "react-icons/pi";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

async function page({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;

  const product = await getProductById(productId);

  if (!product) return notFound();
  const productRank = await getRankById();

  return (
    <div className="mx-auto px-6 py-10 md:w-4/5 md:px-0">
      <Link href={"/my-products"} className="flex gap-x-4">
        <PiArrowLeft className="text-2xl text-gray-500" />
        <p>Go Back</p>
      </Link>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-x-4">
          <Image
            src={product.logo}
            alt="logo"
            width={500}
            height={500}
            className="size-20 rounded-lg border md:size-40"
          />

          <div className="">
            <h1 className="text-3xl font-medium">{product.name}</h1>
            <p className="text-gray-500">{product.website}</p>
            {product.status === "PENDING" && (
              <Badge className="bg-orange-400"> Pending</Badge>
            )}
            {product.status === "ACTIVE" && (
              <Badge className="bg-green-400"> Active</Badge>
            )}
            {product.status === "REJECTED" && (
              <Badge className="bg-red-400"> Rejected</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <EditProduct product={product} />
          <DeleteProduct productId={product.id} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {/* Rank */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Current Rank</CardTitle> 🏅
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {productRank
                ? productRank.findIndex((p) => p.id === product.id) + 1
                : "N/A"}
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Comments </CardTitle> 💬
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{product.comments.length}</div>
          </CardContent>
        </Card>

        {/* Upvotes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Upvotes </CardTitle> 🔺
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{product.upvotes.length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="py-6">
        <Separator />
      </div>
      <h2 className="pb-6 text-xl font-semibold">Community Feedback </h2>
      {product.comments.length > 0 ? (
        <div className="mt-4 space-y-4">
          {product.comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border p-4">
              <div className="flex items-center gap-x-4">
                <Image
                  src={comment.user.image}
                  alt="profile"
                  width={50}
                  height={50}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h2 className="font-semibold">{comment.user.name}</h2>
                  <p className="text-gray-500">{comment.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pt-4">
          <h2 className="text-xl font-semibold">No comments yet</h2>
          <p className="pt-4 text-gray-500">
            Be the first to comment on this product
          </p>
        </div>
      )}
    </div>
  );
}

export default page;
