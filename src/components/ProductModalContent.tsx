"use client";
import { PendingProductType } from "@/types/productTypes";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  PiCaretUpFill,
  PiChatCircle,
  PiTrash,
  PiUploadSimple,
} from "react-icons/pi";
import CarouselComponent from "./CarouselComponent";
import ShareModal from "./modals/ShareProductModal";
import ShareModalContent from "./ShareModalContent";
import { CurrentProductType } from "./ProductItem";
import { commentOnProduct, deleteComment } from "@/lib/actions/productAction";
import { toast } from "sonner";
import { Comment } from "@prisma/client";
import { Badge } from "./ui/badge";

interface ProductModalContentProps {
  currentProduct:
    | PendingProductType
    | CurrentProductType
    // | (null & {
    //     commentData?: Comment & { user: { id: string; name: string } };
    //   });
    | null;
  authenticatedUser: User | undefined;
  totalUpvotes: number;
  hasUpvoted: boolean;
  setTotalUpvotes: Dispatch<SetStateAction<number>>;
  setHasUpvoted: Dispatch<SetStateAction<boolean>>;
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
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(currentProduct?.commentData ?? []);
  const handleShareClick = () => {
    setShareModalVisible(true);
  };

  const handleCommentSubmit = async () => {
    try {
      if (commentText.trim().length === 0) {
        return toast.error("Add a comment first");
      }
      await commentOnProduct(currentProduct?.id, commentText);
      toast.success("Comment added successfully");
      setCommentText("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to added a comment");
    }
  };
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      // Filter out the deleted comment from the comments state
      setComments(
        comments.filter((comment: Comment) => comment.id !== commentId),
      );
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Something went wrong");
    }
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
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What do you think about this product?"
                className="w-full rounded-md p-4 text-gray-600 focus:outline-none"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCommentSubmit}
                className="rounded-md bg-[#ff6154] p-2 text-white"
              >
                Comment
              </button>
            </div>
          </div>
          <div className="space-y-8 py-8">
            {comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-4">
                <Image
                  src={comment.profile}
                  alt="profile"
                  width={50}
                  height={50}
                  className="mt-1 h-8 w-8 cursor-pointer rounded-full"
                />

                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      <h1 className="cursor-pointer font-semibold text-gray-600">
                        {comment.user}
                      </h1>
                      {comment.userId === currentProduct?.userId && (
                        <Badge className="bg-[#88aaff]">Creator</Badge>
                      )}

                      <div className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toDateString()}
                      </div>
                    </div>

                    {(comment.userId === authenticatedUser?.id ||
                      currentProduct?.userId === authenticatedUser?.id) && (
                      <PiTrash
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:cursor-pointer"
                      />
                    )}
                  </div>

                  <div className="mt-2 text-sm text-gray-600 hover:cursor-pointer">
                    {comment.body}
                  </div>
                </div>
              </div>
            ))}
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
