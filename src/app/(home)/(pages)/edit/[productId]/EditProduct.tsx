"use client";
import EditProductModal from "@/components/modals/EditProductModal";
import { useState } from "react";
import { PiPencil } from "react-icons/pi";
import EditProductForm from "./EditProductForm";
import { ProductWithCategoriesAndImages } from "@/types/productTypes";
 
interface IProps {
  product: ProductWithCategoriesAndImages;
}
function EditProduct({ product }: IProps) {
  const [editProductModalVisible, setEditProductModalVisible] = useState(false);
  const handleEditProductClick = () => {
    setEditProductModalVisible(true);
  };
  
  return (
    <>
      <button
        onClick={handleEditProductClick}
        className="flex cursor-pointer items-center justify-center rounded-md bg-emerald-100 p-4"
      >
        <PiPencil className="text-xl text-emerald-500" />
      </button>
      <EditProductModal
        visible={editProductModalVisible}
        setVisible={setEditProductModalVisible}
      >
        <EditProductForm product={product} />
      </EditProductModal>
    </>
  );
}

export default EditProduct;
