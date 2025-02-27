import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Image as ImageType } from "@prisma/client";

interface CarouselProps {
  productImages: (string | ImageType)[];
}

interface CarouselProps {
  productImages: (string | ImageType)[]; // 🔥 يدعم الحالتين
}

const CarouselComponent: React.FC<CarouselProps> = ({ productImages }) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full overflow-hidden md:overflow-visible"
    >
      <CarouselContent>
        {productImages.map((image, index) => {
          const imageUrl = typeof image === "string" ? image : image.url;

          return (
            <CarouselItem key={index} className="basis-1/2">
              <Image
                priority
                src={imageUrl}
                alt="product-image"
                width={500}
                height={500}
                className="h-60 w-full rounded-md border border-gray-200 object-cover"
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CarouselComponent;
