import CarouselComponent from "@/components/CarouselComponent";
import { getProductBySlug } from "@/lib/actions/productAction";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import GoToWebsite from "./GoToWebsite";
async function page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);
  if (!product) {
    return <div>Product not found</div>;
  }
  const productImageUrls = product.images.map((image) => image.url);

  return (
    <div className="mx-auto px-6 py-10 md:w-3/5 md:px-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Image
            src={product.logo}
            alt="logo"
            width={1000}
            height={1000}
            className="h-16 w-16 cursor-pointer rounded-md md:h-24 md:w-24"
          />
          <div>
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="py-2 text-sm text-gray-500">{product.headline}</p>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {product.categories.map((category) => (
                <Link
                  href={`/category/${category.name.toLowerCase()}`}
                  key={category.id}
                  className="cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-gray-600"
                >
                  <h2 className="text-center text-xs">{category.name}</h2>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <GoToWebsite website={product.website} />
      </div>

      {product.description && (
        <div className="pt-4">
          <p className="text-gray-500">{product.description}</p>
        </div>
      )}

      <div className="pt-4">
        {productImageUrls.length > 0 ? (
          <CarouselComponent productImages={productImageUrls} />
        ) : null}
      </div>

      <h2 className="pb-6 pt-10 text-xl font-semibold">Community Feedback</h2>

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
