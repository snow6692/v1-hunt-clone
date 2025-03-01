import Image from "next/image";
import { useEffect, useState } from "react";
import { PiCheck, PiCopy } from "react-icons/pi";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PendingProductType } from "@/types/productTypes";

interface ShareModalContentProps {
  currentProduct: PendingProductType | null;
}

const ShareModalContent: React.FC<ShareModalContentProps> = ({
  currentProduct,
}) => {
  const [copiedText, setCopiedText] = useState("");

  const [isCopied, setIsCopied] = useState(false);

  const urlPrefix = "https://product-hunt.ahmedha.site/product/";

  const handleCopy = () => {
    setIsCopied(true);
  };

  useEffect(() => {
    if (currentProduct && currentProduct.slug) {
      setCopiedText(urlPrefix + currentProduct.slug);
    }
  }, [currentProduct]);

  const handleDiscordClick = () => {
    if (currentProduct && currentProduct.discord) {
      window.open(currentProduct.discord, "_blank");
    }
  };

  const handleTwitterClick = () => {
    if (currentProduct && currentProduct.twitter) {
      window.open(currentProduct.twitter, "_blank");
    }
  };

  return (
    <div>
      <Image
        src={currentProduct?.logo ?? ""}
        alt="logo"
        width={200}
        height={200}
        className="h-24 w-28 rounded-md border bg-white shadow-md"
      />
      <div className="py-4">
        <h1 className="text-2xl font-semibold">Share this product</h1>
        <p className="text-gray-600">
          Stay connect by following the product on social media
        </p>

        <div className="flex gap-4 pt-4">
          <button
            className="w-1/2 rounded-md bg-indigo-100 p-2 text-white"
            onClick={handleDiscordClick}
          >
            <Image
              src={"/logo/discord-logo.png"}
              width={50}
              height={50}
              alt="discord"
              className="mx-auto flex items-center justify-center"
            />
          </button>

          <button
            className="w-1/2 rounded-md bg-sky-100 p-5 text-white"
            onClick={handleTwitterClick}
          >
            <Image
              priority
              src="/logo/twitter-logo.png"
              width={50}
              height={50}
              alt="twitter"
              className="mx-auto flex items-center justify-center"
            />
          </button>
        </div>

        <h1 className="pt-6 font-semibold">Copy Link</h1>
        <div className="mt-2 flex justify-center rounded-md border p-2">
          <input
            type="text"
            value={copiedText}
            className="md:text-md w-full rounded-md text-sm focus:outline-none"
            readOnly
          />
          {isCopied ? (
            <button className="rounded-md bg-[#3daf64] p-2 text-white hover:scale-105">
              <PiCheck className="text-white" />
            </button>
          ) : (
            <CopyToClipboard text={copiedText} onCopy={handleCopy}>
              <button className="rounded-md bg-[#ff6154] p-2 text-white hover:scale-105">
                <PiCopy className="text-white" />
              </button>
            </CopyToClipboard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModalContent;
