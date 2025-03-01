import { getOwnerProducts, isUserPremium } from "@/lib/actions/productAction";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { PiCrown, PiPlus } from "react-icons/pi";

async function MypProductsPage() {
  const products = await getOwnerProducts();
  const isPremium = await isUserPremium();

  return (
    <div className="mx-auto px-6 py-10 lg:w-3/5">
      {products.length === 0 ? (
        <div>
          <h1 className="text-3xl font-bold">No products found</h1>
          <p className="text-gray-500">
            Looks like you have not created any products yes, click the button
            below to create new one.
          </p>
          <Link href={"new-product"}>
            <div className="mt-4 flex h-56 w-60 flex-col items-center justify-center rounded-md bg-[#ff6154] p-4 text-white">
              <PiPlus className="mb-4 text-3xl" />
              <p className="">Create a product</p>
            </div>
          </Link>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold">Your products</h1>
          <p>Manage you products here</p>
          {isPremium ? (
            <div className="mt-10 flex items-center gap-x-4">
              <PiCrown className="text-2xl text-orange-300" />
              <p className="text-lg">You are a premium user</p>
            </div>
          ) : (
            <>
              <p className="pt-6">({products.length} / 2) free products </p>
            </>
          )}

          <></>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-5">
            {products.map((product) => (
              <Link href={`edit/${product.id}`} key={product.id}>
                <div className="">
                  <div className="items-center justify-center rounded-lg p-2 transition-transform duration-300 ease-in-out hover:scale-105">
                    <Image
                      alt="logo"
                      src={product.logo}
                      width={1000}
                      height={1000}
                      className="h-36 w-full rounded-lg object-cover"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MypProductsPage;
