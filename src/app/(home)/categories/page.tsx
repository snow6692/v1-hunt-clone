import { getCategories } from "@/lib/actions/productAction";
import Link from "next/link";

const Categories = async () => {
  const categories = await getCategories();

  return (
    <div className="mx-auto w-4/5 px-6 pt-6 md:px-0 md:py-10 xl:w-3/5">
      <div className="w-full rounded-md bg-gray-100 p-10">
        <h1 className="text-4xl font-semibold">Categories</h1>
        <p className="pt-2 text-gray-500">
          Discover new products in different categories and find what you need
          to make your life easier
        </p>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-6 pt-10">
          {categories.map((category) => (
            <Link
              href={`/category/${category.name.toLowerCase()}`}
              key={category.id}
              className="space-x-10 rounded-xl bg-orange-100 p-5 shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:cursor-pointer"
            >
              <div className="justify-between md:flex">
                <h2 className="font-semibold md:text-2xl">{category.name}</h2>
                <p className="cursor-pointer text-sm hover:underline">
                  View all products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
