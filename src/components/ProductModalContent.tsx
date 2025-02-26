"use client";
import { PendingProductType } from "@/types/productTypes";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { PiCaretUpFill, PiChatCircle, PiUploadSimple } from "react-icons/pi";
import CarouselComponent from "./CarouselComponent";
import ShareModal from "./modals/ShareProductModal";
import ShareModalContent from "./ShareModalContent";

interface ProductModalContentProps {
  currentProduct: PendingProductType | null;
  authenticatedUser: User | undefined;
  totalUpvotes: number;
  hasUpvoted: boolean;
  setTotalUpvotes: () => void;
  setHasUpvoted: () => void;
}
function ProductModalContent({
  authenticatedUser,
  currentProduct,
  hasUpvoted,
  setHasUpvoted,
  setTotalUpvotes,
  totalUpvotes,
}: ProductModalContentProps) {
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const handleShareClick = () => {
    setShareModalVisible(true);
  };
  return (
    <div className="h-full">
      <div className="mx-auto md:w-4/5">
        {currentProduct?.logo ? (
          <Image
            src={currentProduct?.logo}
            alt="logo"
            width={200}
            height={200}
            className="size-20 rounded-md border bg-white shadow-md"
          />
        ) : null}
        <div className="space-y-2 py-4">
          <h1 className="text-2xl font-semibold">{currentProduct?.name}</h1>
          <div className="items-center md:flex md:justify-between">
            <p className="text-xl font-light text-gray-600 md:w-3/5">
              {currentProduct?.headline}
            </p>
            <div className="flex items-center gap-2 pt-4">
              <a
                href={
                  currentProduct?.website?.startsWith("http")
                    ? currentProduct.website
                    : `https://${currentProduct?.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer items-center justify-center rounded-md border p-5"
              >
                Visit
              </a>

              <button
                className={`flex w-full cursor-pointer items-center justify-center gap-x-3 rounded-md bg-gradient-to-r p-5 xl:w-56 ${
                  hasUpvoted
                    ? "border-[#ff6154] from-[#ff6154] to-[#ff4582] text-white"
                    : "border text-black"
                }`}
              >
                <PiCaretUpFill
                  className={`text-xl ${
                    hasUpvoted ? "text-white" : "text-black"
                  }`}
                />
                {totalUpvotes}
              </button>
            </div>
          </div>

          <p className="py-6 text-gray-600">{currentProduct?.description}</p>

          <div className="items-center justify-between md:flex">
            <div className="flex gap-x-2">
              {currentProduct?.categories.map((category) => (
                <Link
                  href={`/category/${category.name.toLowerCase()}`}
                  key={category.id}
                  className="cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-gray-600"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-x-4 py-4">
              <div className="text-md flex cursor-pointer items-center gap-x-1 text-gray-600">
                <PiChatCircle />
                <p>Discuss</p>
              </div>
              <div
                onClick={handleShareClick}
                className="text-md flex cursor-pointer items-center gap-x-1 text-gray-600"
              >
                <PiUploadSimple />
                <p>Share</p>
              </div>
            </div>
          </div>
          {/* Carousel  */}
          <CarouselComponent productImages={currentProduct?.images ?? []} />
          <h1 className="pt-10 font-semibold">Community Feedback</h1>
          <div className="">
            <div className="mt-4 flex w-full gap-4">
              <Image
                src={authenticatedUser?.image ?? ""}
                alt="profile"
                width={50}
                height={50}
                className="h-12 w-12 rounded-full"
              />

              <textarea
                // value={commentText}
                // onChange={handleCommentChange}
                placeholder="What do you think about this product?"
                className="w-full rounded-md p-4 text-gray-600 focus:outline-none"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                // onClick={handleCommentSubmit}
                className="rounded-md bg-[#ff6154] p-2 text-white"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
      <ShareModal visible={shareModalVisible} setVisible={setShareModalVisible}>
        <ShareModalContent currentProduct={currentProduct} />
      </ShareModal>
    </div>
  );
}

export default ProductModalContent;
