import {
  getPendingProducts,
  getProductById,
} from "@/lib/actions/productAction";

export type ProductWithCategoriesAndImages = Awaited<
  ReturnType<typeof getProductById>
>;

export type PendingProductsType = Awaited<
  ReturnType<typeof getPendingProducts>
>;

export type PendingProductType = PendingProductsType[number];
