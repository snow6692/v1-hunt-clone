import ActiveProducts from "@/components/ActiveProducts";
import { getActiveProducts } from "@/lib/actions/productAction";

export default async function Home() {
  const activeProducts = await getActiveProducts();
  return (
    <div className="mx-auto px-6 py-10 md:w-3/5">
      <ActiveProducts  activeProducts={activeProducts} />
    </div>
  );
}
