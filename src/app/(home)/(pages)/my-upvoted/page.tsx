import { auth } from "@/auth";
import { getUpvotedProducts } from "@/lib/actions/productAction";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const MyUpvotedProducts = async () => {
  const authenticatedUser = await auth();

  if (!authenticatedUser) {
    redirect("/");
  }

  const products = await getUpvotedProducts();

  return (
    <div className="mx-auto px-6 pt-10 md:w-3/5 md:px-0">
      {products.length === 0 ? (
        <div>
          <h1 className="text-3xl font-bold">
            You have not upvoted any products yet
          </h1>
          <p className="pt-4 text-gray-500">
            Upvote products to get started, and they will display here
          </p>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold">Your Upvotes</h1>
            <p className="text-gray-500">
              View all the products you have upvoted
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {products.map((product: Product) => (
              <Link href={`/product/${product.slug}`} key={product.id}>
                <div>
                  <div className="items-center justify-center rounded-lg border transition-transform duration-300 ease-in-out hover:scale-105">
                    <Image
                      src={product.logo}
                      alt="logo"
                      width={1000}
                      height={1000}
                      className="h-40 rounded-t-lg object-cover"
                    />

                    <h2 className="p-4 text-lg font-semibold">
                      {product.name}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyUpvotedProducts;
