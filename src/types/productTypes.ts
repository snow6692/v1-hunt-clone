import { getProductById } from "@/lib/actions/productAction";

export type ProductWithCategoriesAndImages = Awaited<
  ReturnType<typeof getProductById>
>;
