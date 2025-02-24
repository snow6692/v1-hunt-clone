"use client";
import Modal from "@/components/ui/modals/modal";
import { deleteProduct } from "@/lib/actions/productAction";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { PiStorefront, PiTrash } from "react-icons/pi";
import { toast } from "sonner";

interface IProps {
  productId: string;
}
function DeleteProduct({ productId }: IProps) {
  const [deleteProductModalVisible, setDeleteProductModalVisible] =
    useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);
  const router = useRouter();

  const handleDeleteProductClick = () => {
    setDeleteProductModalVisible(true);
  };

  const handleCancel = () => {
    setDeleteProductModalVisible(false);
  };
  const handleConfirmationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value.toLowerCase();
    setConfirmationInput(inputText);
    setIsDeleteButtonEnabled(inputText === "delete");
  };

  const handleConfirmDelete = () => {
    if (confirmationInput === "delete") {
      setTimeout(async () => {
        try {
          await deleteProduct(productId);
          toast.success("Product deleted successfully!");
          router.push("/my-products");
          router.refresh();
        } catch (error) {
          console.error(error);
        }
      }, 3000);
    }
  };

  return (
    <>
      <button
        onClick={handleDeleteProductClick}
        className="flex cursor-pointer items-center justify-center rounded-md bg-red-100 p-4"
      >
        <PiTrash className="text-xl text-red-500" />
      </button>

      <Modal
        visible={deleteProductModalVisible}
        setVisible={setDeleteProductModalVisible}
      >
        <div>
          <PiStorefront className="mb-10 rounded-md bg-red-100 p-1 text-5xl text-red-500" />
          <h1 className="mb-10 text-xl font-semibold">Delete Product</h1>

          <p className="text-sm">
            We&apos;re sorry to see you go. Once your product is deleted, all of
            your content will be permanently gone, including your products and
            product settings.
          </p>

          <p className="py-10 text-sm">
            This action cannot be undone. This will permanently delete your
            product and all of your content.
          </p>

          <p className="text-sm">To confirm deletion, type “delete” below:</p>

          <input
            type="text"
            className="mt-6 w-full rounded-xl border p-4 focus:outline-none"
            value={confirmationInput}
            onChange={handleConfirmationInputChange}
          />

          <div className="mt-10 flex justify-end">
            <button
              className="mr-4 cursor-pointer rounded-full border border-red-500 bg-white px-4 py-2 text-sm font-light text-red-500"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className={`${
                isDeleteButtonEnabled
                  ? "rounded-full bg-red-500 text-sm text-white"
                  : "cursor-not-allowed rounded-full bg-gray-200 text-sm text-gray-500"
              } px-4 py-2`}
              disabled={!isDeleteButtonEnabled}
              onClick={handleConfirmDelete}
            >
              Confirm delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeleteProduct;
