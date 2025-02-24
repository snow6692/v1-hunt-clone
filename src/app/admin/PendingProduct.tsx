"use client";

import { useState } from "react";
import { PiCheckCircle, PiXCircle } from "react-icons/pi";

import { Category, Image as ImageType } from "@prisma/client";
import { PendingProductsType, PendingProductType } from "@/types/productTypes";
import { User } from "next-auth";
import Image from "next/image";

interface PendingProductsProps {
  pendingProducts: PendingProductsType;
  authenticatedUser: User | undefined;
}

const PendingProducts: React.FC<PendingProductsProps> = ({
  pendingProducts,
  authenticatedUser,
}) => {
  const [currentProduct, setCurrentProduct] =
    useState<PendingProductType | null>(null);

  const [viewProductModalVisible, setViewProductModalVisible] = useState(false);
  const [activateProductModalVisible, setActivateProductModalVisible] =
    useState(false);
  const [rejectProductModalVisible, setRejectProductModalVisible] =
    useState(false);

  const formattedProducts = pendingProducts
    ? pendingProducts.map((product) => {
        if (!product) return;

        const {
          id,
          name,
          slug,
          headline,
          description,
          logo,
          releaseDate,
          website,
          twitter,
          discord,
          createdAt,
          updatedAt,
          userId,
          status,
          images,
          categories,
        } = product;

        return {
          id,
          name,
          slug,
          headline,
          description,
          logo,
          releaseDate,
          website,
          twitter,
          discord,
          createdAt,
          updatedAt,
          userId,
          status,
          images: images.map((image) => image.url),
          categories: categories.map((category) => category.name),
        };
      })
    : [];

  console.log(formattedProducts, "formatted products here");

  const handleViewProductModal = (product: PendingProductType) => {
    const formattedProduct = formattedProducts.find(
      (formattedProduct) => formattedProduct?.id === product.id,
    );

    if (!formattedProduct) return;

    setCurrentProduct({
      ...product,
      images: formattedProduct.images as unknown as ImageType[],
      categories: formattedProduct.categories as unknown as Category[],
    });

    setViewProductModalVisible(true);
  };

  const handleActivateProductModal = (product: PendingProductType) => {
    setCurrentProduct(product);
    setActivateProductModalVisible(true);
  };

  const handleRejectProductModal = (product: PendingProductType) => {
    setCurrentProduct(product);
    setRejectProductModalVisible(true);
  };

  return (
    <div className="mt-6 flex w-full flex-col">
      {formattedProducts.map((product) => (
        <div
          className="flex items-center justify-between rounded-md border p-4"
          key={product?.id}
        >
          <div className="flex items-center gap-x-6">
            {product?.logo ? (
              <Image
                className="w-16 cursor-pointer rounded-md md:w-20"
                src={product?.logo}
                alt={product?.name + "'s logo"}
                width={200}
                height={200}
              />
            ) : null}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{product?.name}</h1>
            <p className="hidden pr-6 text-sm text-gray-500 md:flex">
              {product?.description}
            </p>
            <div className="hidden font-semibold text-gray-500 md:flex">
              Release Date: {product?.releaseDate}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingProducts;
