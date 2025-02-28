"use client";
import { searchProducts } from "@/lib/actions/productAction";
import { Product } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { PiMagnifyingGlass } from "react-icons/pi";
function Search() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    if (inputValue.trim() !== "") {
      const products: Product[] = await searchProducts(inputValue);
      //Filter only active

      const activeProducts = await products.filter(
        (product) => product.status === "ACTIVE",
      );
      setSearchResults(activeProducts);
      setIsDropdownVisible(true);
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  };
  const handleItemClick = (slug: string, productName: string) => {
    setQuery(productName);
    setIsDropdownVisible(false);
    router.push(`/product/${slug}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative ml-4 flex items-center rounded-full bg-[#f5f8ff] text-gray-500">
      <PiMagnifyingGlass className="ml-2" />

      <input
        type="text"
        placeholder="Search..."
        className="rounded-full bg-[#f5f8ff] p-2 text-xs focus:outline-none"
        value={query}
        onChange={handleSearch}
        ref={searchInputRef}
      />
      {isDropdownVisible && searchResults.length > 0 && (
        <ul className="absolute top-full mt-2 w-full rounded-md border bg-white">
          {searchResults.map((product) => (
            <li
              key={product.id}
              className="flex cursor-pointer items-center gap-x-2 p-2 text-sm hover:bg-gray-100"
              onClick={() => handleItemClick(product.slug, product.name)}
            >
              <Image
                src={product.logo}
                alt="logo"
                width={50}
                height={50}
                className="h-8 w-8 rounded-md"
              />
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search;
