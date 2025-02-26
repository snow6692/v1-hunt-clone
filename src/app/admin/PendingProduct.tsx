"use client";

import { useState } from "react";
import { PiCheckCircle, PiXCircle } from "react-icons/pi";

import { Category, Image as ImageType } from "@prisma/client";
import { PendingProductsType, PendingProductType } from "@/types/productTypes";
import { User } from "next-auth";
import Image from "next/image";
import ProductModal from "@/components/modals/ProductModal";
import ActivateProductModal from "@/components/modals/ActivateProductModal";
import RejectProductModal from "@/components/modals/RejectProductModal";
import ProductModalContent from "@/components/ProductModalContent";
import ActivateProductContent from "@/components/ActivateProductContent";
import RejectProductModalContent from "@/components/RejectProductModalContent";

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

  const formattedProducts: PendingProductType[] = pendingProducts
    ? pendingProducts
        .map((product) => {
          if (!product) return null;

          return {
            ...product,
            images: product.images.map((image) => ({
              id: image.id,
              createdAt: image.createdAt,
              updatedAt: image.updatedAt,
              productId: image.productId,
              url: image.url,
            })),
            categories: product.categories.map((category) => ({
              id: category.id,
              name: category.name,
            })),
          };
        })
        .filter((product): product is PendingProductType => product !== null)
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
          <div className="flex items-center justify-center gap-2 md:gap-x-4">
            <button
              onClick={() => handleViewProductModal(product)}
              className="rounded-md bg-[#ff6154] px-4 py-2 text-center text-sm text-white"
            >
              View Product
            </button>
            <button
              onClick={() => handleActivateProductModal(product)}
              className="rounded-md bg-emerald-100 px-4 py-2 text-center text-sm text-white"
            >
              <PiCheckCircle className="text-xl text-emerald-500" />
            </button>

            <button
              onClick={() => handleRejectProductModal(product)}
              className="rounded-md bg-red-100 px-4 py-2 text-center text-sm text-white"
            >
              <PiXCircle className="text-xl text-red-500" />
            </button>
          </div>
        </div>
      ))}
      <ProductModal
        visible={viewProductModalVisible}
        setVisible={setViewProductModalVisible}
      >
        <ProductModalContent
          hasUpvoted={false}
          totalUpvotes={0}
          authenticatedUser={authenticatedUser}
          setTotalUpvotes={() => {}}
          setHasUpvoted={() => {}}
          currentProduct={currentProduct}
        />
        product
      </ProductModal>
      <ActivateProductModal
        visible={activateProductModalVisible}
        setVisible={setActivateProductModalVisible}
      >
        <ActivateProductContent
          currentProduct={currentProduct}
          closeModal={() => setActivateProductModalVisible(false)}
        />
      </ActivateProductModal>

      <RejectProductModal
        visible={rejectProductModalVisible}
        setVisible={setRejectProductModalVisible}
      >
        reject
        <RejectProductModalContent
          currentProduct={currentProduct}
          closeModal={() => setRejectProductModalVisible(false)}
        />
      </RejectProductModal>
    </div>
  );
};

export default PendingProducts;
