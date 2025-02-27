import {
  getActiveProducts,
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

export type ActiveProducts = Awaited<ReturnType<typeof getActiveProducts>>;
export type ActiveProduct = ActiveProducts[number];
