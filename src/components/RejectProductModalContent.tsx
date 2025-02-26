"use client";
import { rejectProduct } from "@/lib/actions/productAction";
import { PendingProductType } from "@/types/productTypes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { PiXCircle } from "react-icons/pi";
import { toast } from "sonner";

interface IProps {
  currentProduct: PendingProductType | null;
  closeModal: () => void;
}

function RejectProductModalContent({ currentProduct, closeModal }: IProps) {
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleRejectButton = async () => {
    try {
      await rejectProduct(currentProduct?.id, reason);
      toast.error("Product rejected successfully");
      closeModal();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-full overflow-auto">
      <div>
        <PiXCircle className="mb-4 rounded-md bg-red-100 p-1 text-5xl text-red-500" />
        <h1 className="mb-4 text-3xl font-bold">Reject Product</h1>
        <p className="mb-4 text-gray-500">
          Are you sure you want to reject this product?
        </p>
        <p className="text-gray-500">
          Once rejected, the owner will be notified with the necessary steps to
          take.
        </p>

        <div>
          <h1 className="py-4 font-semibold text-gray-500">
            Reason for rejection
          </h1>

          <textarea
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-md border p-2 focus:outline-none"
            placeholder="Enter reason for rejection"
            rows={4}
            value={reason}
          >
            {reason}
          </textarea>
        </div>

        <button
          onClick={handleRejectButton}
          className="pt-4 text-red-500 hover:underline"
        >
          Click here to reject
        </button>
      </div>
    </div>
  );
}

export default RejectProductModalContent;
