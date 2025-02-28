"use client";
import { ActiveProduct } from "@/types/productTypes";
import { User } from "next-auth";
import Image from "next/image";
import {
  PiArrowBendDoubleUpRight,
  PiCaretUpFill,
  PiChatCircle,
} from "react-icons/pi";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductModal from "./modals/ProductModal";
import ProductModalContent from "./ProductModalContent";
import Modal from "./ui/modals/modal";
import AuthContent from "./navbar/AuthContent";
import { useState } from "react";
import { upvoteProduct } from "@/lib/actions/productAction";
import { Comment } from "@prisma/client";

export type CurrentProductType = ActiveProduct & {
  commentsLength: number;
  comments: Comment[];
};

interface IProps {
  authenticatedUser: User | undefined;
  product: CurrentProductType;
}
function ProductItem({ authenticatedUser, product }: IProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentProduct, setCurrentProduct] =
    useState<CurrentProductType | null>(null);

  const [hasUpvoted, setHasUpvoted] = useState(
    product.upvotes?.some((upvote) => upvote.user.id === authenticatedUser?.id),
  );
  const [totalUpvotes, setTotalUpvotes] = useState(product.upvotes.length || 0);

  const releaseDate = product.releaseDate && new Date(product.releaseDate);
  const currentDate = new Date();
  let displayReleaseDate;
  if (releaseDate > currentDate) {
    displayReleaseDate = releaseDate.toString();
  } else {
    displayReleaseDate = "Available Now";
  }
  const handleProductItemClick = () => {
    if (!authenticatedUser) {
      setShowLoginModal(true);
    } else {
      setCurrentProduct(product);
      setShowProductModal(true);
    }
  };

  const handleArrowClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    const fixedWebsite = product.website.startsWith("http")
      ? product.website
      : `https://${product.website}`;
    window.open(fixedWebsite, "_blank");
  };
  const handleCategoryClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.stopPropagation();
  };

  const handleUpvoteClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    try {
      await upvoteProduct(product.id);
      setHasUpvoted(!hasUpvoted);
      setTotalUpvotes(hasUpvoted ? totalUpvotes - 1 : totalUpvotes + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const variants = {
    initial: { scale: 1 },
    upvoted: { scale: [1, 1.2, 1], transition: { duration: 0.3 } },
  };
  return (
    <div
      onClick={handleProductItemClick}
      className="w-full cursor-pointer rounded-md from-[#ffe6d3] via-[#fdfdfd] to-white p-2 py-4 hover:bg-gradient-to-bl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={product.logo}
            alt="logo"
            width={1000}
            height={1000}
            className="h-12 w-12 rounded-md"
          />

          <div className="ml-4">
            <div className="items-center gap-x-2 md:flex">
              <h1 className="text-sm font-semibold">{product.name}</h1>
              <p className="hidden text-xs md:flex">-</p>
              <p className="pr-2 text-xs text-gray-500 md:text-sm">
                {product.headline}
              </p>
              <div
                onClick={handleArrowClick}
                className="hidden cursor-pointer md:flex"
              >
                <PiArrowBendDoubleUpRight />
              </div>
            </div>

            <div className="hidden items-center gap-x-2 md:flex">
              <div className="flex items-center gap-x-1 text-xs text-gray-500">
                {product.commentsLength}
                <PiChatCircle />
              </div>

              {product.categories.map((category) => (
                <div key={category.id} className="text-xs text-gray-500">
                  <div className="flex items-center gap-x-1">
                    <div className="mr-1">•</div>
                    <Link
                      href={`/category/${category.name.toLowerCase()}`}
                      className="hover:underline"
                      onClick={handleCategoryClick}
                    >
                      {category.name}
                    </Link>
                  </div>
                </div>
              ))}

              <div className="text-xs text-gray-500">
                <div className="flex items-center gap-x-1">
                  <div className="mr-1">•</div>
                  {displayReleaseDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm">
          <motion.div
            onClick={handleUpvoteClick}
            variants={variants}
            animate={hasUpvoted ? "upvoted" : "initial"}
          >
            {hasUpvoted ? (
              <div className="flex flex-col items-center rounded-md border border-[#ff6154] bg-gradient-to-bl from-[#ff6154] to-[#ff4582] px-2 text-white">
                <PiCaretUpFill className="text-xl" />
                {totalUpvotes}
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-md border px-2">
                <PiCaretUpFill className="text-xl" />
                {totalUpvotes}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <ProductModal visible={showProductModal} setVisible={setShowProductModal}>
        <ProductModalContent
          currentProduct={currentProduct}
          authenticatedUser={authenticatedUser}
          setTotalUpvotes={setTotalUpvotes}
          totalUpvotes={totalUpvotes}
          hasUpvoted={hasUpvoted}
          setHasUpvoted={setHasUpvoted}
        />
      </ProductModal>

      <Modal visible={showLoginModal} setVisible={setShowLoginModal}>
        <AuthContent />
      </Modal>
    </div>
  );
}

export default ProductItem;
