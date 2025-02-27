import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getProductsByCategoryName } from "@/lib/actions/productAction";
import Image from "next/image";
import Link from "next/link";
import React from "react";

async function page({ params }: { params: Promise<{ category: string }> }) {
  const category = (await params).category;

  const capitalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);
  const products = await getProductsByCategoryName(capitalizedCategory);
  return (
    <div className="mx-auto px-6 pt-10 md:w-3/5 md:px-0">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{capitalizedCategory}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="pt-10 text-4xl font-semibold">{capitalizedCategory}</h1>
      <p className="pt-2 text-gray-500">
        Check out whats&apos;s going on in the {capitalizedCategory}! Discover
        new products
      </p>

      <div className="space-y-4 pt-10">
        {products.map((product) => (
          <Link
            href={`/product/${product.slug}`}
            key={product.id}
            className="flex items-center gap-x-4 rounded-md border p-2"
          >
            <Image
              src={product.logo}
              alt="logo"
              width={1000}
              height={1000}
              className="h-16 w-16 cursor-pointer rounded-md md:h-20 md:w-20"
            />
            <div>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500 md:py-2">
                {product.headline}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default page;
