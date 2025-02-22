"use client";

import { ImagesUploader } from "@/components/ImagesUploader";
import { LogoUploader } from "@/components/LogoUploader";
import { updateProduct } from "@/lib/actions/productAction";
import { ProductWithCategoriesAndImages } from "@/types/productTypes";
import { Category, Image as ImageType } from "@prisma/client";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { PiCheckCircle, PiFlag, PiPencilLine } from "react-icons/pi";
import { toast } from "sonner";

interface EditProductFormProps {
  product: ProductWithCategoriesAndImages;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product }) => {
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState("");
  const [isEditingProductImages, setIsEditingProductImages] = useState(false);
  const [uploadedProductImages, setUploadedProductImages] = useState<string[]>(
    [],
  );

  const router = useRouter();

  const [name, setName] = useState<string | undefined>(product?.name);
  const [headline, setHeadline] = useState(product?.headline);
  const [description, setDescription] = useState(product?.description);
  const [releaseDate, setReleaseDate] = useState(product?.releaseDate);
  const [website, setWebsite] = useState(product?.website);
  const [twitter, setTwitter] = useState(product?.twitter);
  const [discord, setDiscord] = useState(product?.discord);
  const [categories, setCategories] = useState(product?.categories);
  const [slug, setSlug] = useState(product?.slug);

  const handleLogoUpload = (url?: string) => {
    if (url) {
      setUploadedLogoUrl(url);
      setIsEditingLogo(false);
    } else {
      setIsEditingLogo(true);
    }
  };

  const handleProductImagesUpload = (urls: string[]) => {
    setUploadedProductImages(urls);
    setIsEditingProductImages(false);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const productName = e.target.value;
    const truncatedName = productName.slice(0, 30);
    setName(truncatedName);
  };

  useEffect(() => {
    // Update slug when name changes
    const truncatedName = name?.slice(0, 30);
    const slugValue = truncatedName!
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "-");
    setSlug(slugValue);
  }, [name]); // Trigger effect when name changes

  const onSave = async () => {
    try {
      if (!product?.id) throw new Error("");
      await updateProduct(product?.id, {
        name: name ?? "",
        headline: headline ?? "",
        description: description ?? "",
        releaseDate: releaseDate ?? "",
        website: website ?? "",
        slug: slug ?? "",
        twitter: twitter ?? "",
        discord: discord ?? "",
        category: categories ? categories.map((category) => category.name) : [],

        logo: uploadedLogoUrl || product.logo || "",
        images:
          uploadedProductImages.length > 0
            ? uploadedProductImages
            : product.images.map((image: ImageType) => image.url),
      });
      toast("Product updated successfully.");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast(`There was an error updating the product, ${error.message}`);
      }
    }
  };

  return (
    <div className="h-full">
      <div className="mx-auto flex items-center gap-4">
        <PiPencilLine className="text-3xl text-emerald-500" />
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      <div className="mt-10 w-full items-center gap-x-4 rounded-md bg-emerald-100 p-10 md:flex">
        <PiFlag className="mb-4 text-5xl text-emerald-500 md:mb-0" />
        <div className="text-gray-600">
          This is the product form. You can update the product details here. If
          your product is currently live, and you make changes to the product
          details. It will delist the product from the marketplace until it is
          reviewed and approved by the admin.
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <h1 className="font-medium">Logo</h1>
          {isEditingLogo ? (
            <div>
              <LogoUploader
                endpoint="productLogo"
                onChange={handleLogoUpload}
              />
              <button
                onClick={() => setIsEditingLogo(false)}
                className="mt-2 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <Image
                src={
                  uploadedLogoUrl && uploadedLogoUrl.trim() !== ""
                    ? uploadedLogoUrl
                    : product?.logo || ""
                }
                alt="logo"
                width={200}
                height={200}
                className="w-28 cursor-pointer rounded-md border md:w-60"
              />

              <button
                onClick={() => setIsEditingLogo(true)}
                className="mt-2 cursor-pointer text-sm text-blue-500 hover:underline"
              >
                Change Logo
              </button>
            </div>
          )}
        </div>

        <div>
          <h1 className="font-medium">Product Name</h1>
          <input
            type="text"
            className="mt-6 w-full rounded-xl border p-4 focus:outline-none"
            value={name}
            onChange={handleNameChange}
          />
        </div>

        <div>
          <div className="font-medium">Website</div>
          <input
            type="text"
            className="mt-6 w-full rounded-xl border p-4 focus:outline-none"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div>
          <div className="font-medium">Release Date</div>
          <input
            type="text"
            className="mt-6 w-full rounded-xl border p-4 focus:outline-none"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>

        <div>
          <div className="font-medium">Headline</div>
          <textarea
            className="mt-6 w-full rounded-xl border p-4 focus:outline-none"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>

        <div>
          <div className="font-medium">Short Description</div>
          <textarea
            className="mt-6 w-full rounded-xl border p-4 focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <div className="font-medium">Twitter</div>
          <input
            type="text"
            className="mt-6 w-full rounded-xl border p-4 focus:outline-none"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>

        <div>
          <div className="font-medium">Discord</div>
          <input
            type="text"
            className="mt-6 w-full rounded-xl border p-4 focus:outline-none"
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <h1 className="font-medium">Categories</h1>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {product?.categories.map((category: Category) => (
              <div key={category.id}>
                <div className="rounded-full bg-gray-200 p-2 text-center text-sm">
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <div className="mb-2 font-medium">Product Images</div>
          {isEditingProductImages ? null : (
            <div className="grid grid-cols-5 gap-4">
              {uploadedProductImages.length > 0 &&
                uploadedProductImages.map((url: string) => (
                  <div key={url}>
                    <Image
                      priority
                      src={url}
                      alt={"Product images"}
                      width={200}
                      height={200}
                      className="rounded-md border-gray-200 hover:cursor-pointer"
                    />
                  </div>
                ))}
              {/* Display uploaded images if available, else render product images */}
              {uploadedProductImages.length === 0 &&
                product?.images &&
                product.images.map((image) => (
                  <div key={image.id}>
                    <Image
                      priority
                      src={image.url}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-40 rounded-md border-gray-200 hover:cursor-pointer"
                    />
                  </div>
                ))}
            </div>
          )}

          {isEditingProductImages ? (
            <div>
              <ImagesUploader
                endpoint="productImages"
                onChange={handleProductImagesUpload}
              />
              <button
                className="mt-2 cursor-pointer"
                onClick={() => setIsEditingProductImages(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingProductImages(true)}
              className="my-2 cursor-pointer text-sm text-blue-500 hover:underline"
            >
              Click to upload images
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end py-10">
        <button
          onClick={onSave}
          className="w-40 cursor-pointer rounded-md bg-emerald-500 p-4 text-center text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProductForm;
