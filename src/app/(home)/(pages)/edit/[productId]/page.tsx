import { Badge } from "@/components/ui/badge";
import { getProductById } from "@/lib/actions/productAction";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PiArrowLeft } from "react-icons/pi";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";

async function page({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;

  const product = await getProductById(productId);

  if (!product) return notFound();
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
          <DeleteProduct />
        </div>
      </div>
    </div>
  );
}

export default page;
