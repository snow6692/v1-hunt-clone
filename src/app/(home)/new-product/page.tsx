"use client";
import { ImagesUploader } from "@/components/ImagesUploader";
import { format } from "date-fns";
import { LogoUploader } from "@/components/LogoUploader";
import { CATEGORIES } from "@/constants/constants";
import Image from "next/image";
import React, { useState, useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PiCalendar, PiPlanet } from "react-icons/pi";
import { FaDiscord, FaTwitter } from "react-icons/fa";
function NewProductPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [headline, setHeadline] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [uploadLogoUrl, setUploadLogoUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uploadedProductImages, setUploadedProductImages] = useState<string[]>(
    [],
  );
  const nextStep = useCallback(() => {
    setStep(step + 1);
  }, [step]);

  const previousStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const productName = e.target.value;
    const truncatedName = productName.slice(0, 30);
    setName(truncatedName);

    //create slug from product name
    const slugValue = truncatedName
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/\./g, "-") // Replace periods with hyphens in the slug
      .replace(/\\/g, "-") // Replace periods with hyphens in the slug
      .replace(/\//g, "-"); // Replace periods with hyphens in the slug
    setSlug(slugValue);
  };
  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebsite(e.target.value);
  };
  const handleDiscordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscord(e.target.value);
  };
  const handleTwitterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTwitter(e.target.value);
  };

  const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setHeadline(e.target.value.slice(0, 70));

  const handleShortDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => setShortDescription(e.target.value.slice(0, 300));

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter((prevCategory) => prevCategory !== category),
      );
    } else if (selectedCategories.length < 3) {
      setSelectedCategories((prevCategories) => [...prevCategories, category]);
    }
  };

  const handleLogoUpload = useCallback((url: any) => {
    setUploadLogoUrl(url);
  }, []);
  const handleProductImagesUpload = useCallback((urls: string[]) => {
    setUploadedProductImages(urls);
  }, []);
  return (
    <div className="flex items-center justify-center py-8 md:py-20">
      <div className="px-8 md:mx-auto md:w-3/5">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold"> 📦 New product</h1>
            <p className="mt-4 text-xl font-light leading-8">
              Ready to showcase your product to the world? You came to the right
              place. Follow the steps below to get started.
            </p>
            {/* Name */}
            <div className="mt-10">
              <label htmlFor="name" className="font-medium">
                Name of the product{" "}
              </label>
              <input
                type="text"
                maxLength={30}
                className="w-full rounded-md border p-2 focus:outline-none"
                value={name}
                onChange={handleNameChange}
                id="name"
              />
              <div className="mt-1 text-sm text-gray-500">{name.length}/30</div>
            </div>

            {/* Slug */}
            <div className="mt-10">
              <h2 className="font-medium">
                Slug (URL) - This will be used to create a unique URL for your
                product
              </h2>

              <input
                type="text"
                value={slug}
                className="mt-2 w-full rounded-md border p-2 focus:outline-none"
                readOnly
              />
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold">
              {" "}
              📊 Choose categories for you product
            </h1>
            <p className="mt-4 text-xl font-light leading-8">
              Choose at least 3 categories that best fits your product. This
              will help people discover your product.
            </p>

            <div className="mt-10">
              <h2 className="font-medium">Select categories</h2>
              <div className="grid grid-cols-4 items-center justify-center gap-2 pt-4">
                {CATEGORIES.map((category) => (
                  <div
                    className="flex rounded-full border"
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                  >
                    <div
                      className={`w-full cursor-pointer p-2 text-center text-xs md:text-sm ${
                        selectedCategories.includes(category)
                          ? "rounded-full bg-[#ff6154] text-white"
                          : "text-black"
                      } `}
                    >
                      {category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold">Product Details</h1>
            <p className="mt-4 text-xl font-light leading-8">
              Keep it simple and clear. Describe your products in a way that
              make it easy for people to understand what it does
            </p>
            <div className="mt-10">
              <label htmlFor="headline" className="font-medium">
                Headline
              </label>
              <input
                type="text"
                value={headline}
                className="mt-2 w-full rounded-md border p-2 focus:outline-none"
                onChange={handleHeadlineChange}
                id="headline"
              />

              <div className="mt-1 text-sm text-gray-500">
                {headline.length} / 70
              </div>
            </div>

            <div className="mt-10">
              <label htmlFor="description" className="font-medium">
                Short Description
              </label>
              <textarea
                className="mt-2 w-full rounded-md border p-2 focus:outline-none"
                rows={8}
                maxLength={300}
                value={shortDescription}
                onChange={handleShortDescriptionChange}
                id="description"
              />

              <div className="mt-1 text-sm text-gray-500">
                {shortDescription.length} / 300
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold">
              🖼️ Add images to showcase your product
            </h1>
            <p className="mt-4 text-xl font-light leading-8">
              Include images that best represent your product. This will help
              people understand what your product looks like.
            </p>
            <div className="mt-10">
              <label className="font-medium">Logo</label>
              {uploadLogoUrl ? (
                <div className="mt-2">
                  <Image
                    src={uploadLogoUrl}
                    alt="logo"
                    width={100}
                    height={100}
                    className="size-40 rounded-md object-cover"
                  />
                </div>
              ) : (
                <LogoUploader
                  endpoint="productLogo"
                  onChange={handleLogoUpload}
                />
              )}
            </div>

            <div className="mt-4">
              <div className="font-medium">
                Product Images ( upload at least 3 images )
              </div>
              {uploadedProductImages.length > 0 ? (
                <div className="mt-2 gap-2 space-y-4 md:flex md:space-y-0">
                  {uploadedProductImages.map((url, index) => (
                    <div key={index} className="relative h-40 md:w-40">
                      <Image
                        priority
                        src={url}
                        alt="Uploaded Product Image"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <ImagesUploader
                  endpoint="productImages"
                  onChange={handleProductImagesUpload}
                />
              )}
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold"> 🗓️ Release Date</h1>
            <p className="mt-4 text-xl font-light leading-8">
              When will your product be available to the public select the date.
            </p>
            <div className="mt-10">
              <div className="pb-3 font-medium">Release Date</div>
              <div className="flex items-center justify-center gap-5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[300px] pl-3 text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      {date ? format(date, "PPP") : <span>Pick a date</span>}

                      <PiCalendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => setDate(date)}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <Button onClick={() => setDate(new Date())}>Reset data</Button>
              </div>
            </div>
          </div>
        )}

        {/* Strep 6  */}
        {step === 6 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold">Additional Links </h1>
            <p className="mt-4 text-xl font-light leading-8">
              Add links to your product&apos;s website, social media, and other
              platforms
            </p>

            <div className="mt-10">
              <div className="flex items-center gap-x-2 font-medium">
                <PiPlanet className="text-2xl text-gray-600" />
                <span>Website</span>
              </div>
              <input
                type="text"
                className="w-full rounded-md border p-2 focus:outline-none"
                placeholder="https://www.yourdomin.xxx"
                value={website}
                onChange={handleWebsiteChange}
              />
            </div>
            <div className="mt-10">
              <div className="flex items-center gap-x-2 font-medium">
                <FaTwitter className="text-2xl text-gray-600" />
                <span>Twitter</span>
              </div>
              <input
                type="text"
                className="w-full rounded-md border p-2 focus:outline-none"
                placeholder="https://www.twitter.come"
                value={twitter}
                onChange={handleTwitterChange}
              />
            </div>
            <div className="mt-10">
              <div className="flex items-center gap-x-2 font-medium">
                <FaDiscord className="text-2xl text-gray-600" />
                <span>Discord</span>
              </div>
              <input
                type="text"
                className="w-full rounded-md border p-2 focus:outline-none"
                placeholder="https://www.discord.xxx"
                value={discord}
                onChange={handleDiscordChange}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-5">
          <button className="mt-20" onClick={previousStep}>
            Previous step
          </button>
          <button className="mt-20" onClick={nextStep}>
            next step
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewProductPage;
