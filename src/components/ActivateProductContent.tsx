"use client";
import { activeProduct } from "@/lib/actions/productAction";
import { PendingProductType } from "@/types/productTypes";
import { useRouter } from "next/navigation";
import React from "react";
import { PiCheckCircle } from "react-icons/pi";
import { toast } from "sonner";

interface IProps {
  currentProduct: PendingProductType | null;
  closeModal: () => void;
}
function ActivateProductContent({ currentProduct, closeModal }: IProps) {
  const router = useRouter();
  const handleActivateButton = async () => {
    try {
      await activeProduct(currentProduct?.id);
      toast.success("Product activated successfully!");
      closeModal();
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Activate product failed!");
    }
  };
  return (
    <div className="h-full">
      <div>
        <PiCheckCircle className="mb-4 rounded-md bg-emerald-100 p-1 text-5xl text-emerald-500" />
        <h1 className="mb-4 text-3xl font-bold">Activate Product</h1>
        <p className="mb-4 text-gray-500">
          Are you sure you want to activate this product ?
        </p>

        <p className="pb-10 text-gray-500">
          Once activated, the product will be visible to the public and users
          will be able to interact with it
        </p>

        <button
          onClick={handleActivateButton}
          className="text-emerald-500 hover:underline"
        >
          Click here to activate
        </button>
      </div>
    </div>
  );
}

export default ActivateProductContent;
