"use server";

import { auth } from "@/auth";
import prisma from "../db";
import { revalidatePath } from "next/cache";

interface ProductData {
  name: string;
  slug: string;
  headline: string;
  description: string;
  logo: string;
  releaseDate: string;
  website: string;
  twitter: string;
  discord: string;
  images: string[];
  category: string[];
  rank?: number;
}
export async function createProduct({
  name,
  slug,
  headline,
  description,
  logo,
  releaseDate,
  website,
  twitter,
  discord,
  images,
  category,
}: ProductData) {
  try {
    const authenticatedUser = await auth();

    if (!authenticatedUser) {
      throw new Error("You must be signed in to create a product");
    }

    const userId = authenticatedUser.user?.id;

    const product = await prisma.product.create({
      data: {
        name,
        rank: 0,
        slug,
        headline,
        description,
        logo,
        releaseDate,
        website,
        twitter,
        discord,
        status: "PENDING",
        categories: {
          connectOrCreate: category.map((name) => ({
            where: {
              name,
            },
            create: {
              name,
            },
          })),
        },
        images: {
          createMany: {
            data: images.map((image) => ({ url: image })),
          },
        },

        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    revalidatePath("/my-products");

    return product;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getOwnerProducts() {
  const session = await auth();
  if (!session) return [];
  const userId = await session?.user?.id;

  const products = await prisma.product.findMany({ where: { userId } });

  return products;
}

export async function getProductById(id: string) {
  try {
    const authenticatedUser = await auth();

    if (!authenticatedUser) {
      throw new Error("You must be signed in to create a product");
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        images: true,
      },
    });
    if (!product) throw new Error("This product not found");

    return product;
  } catch (error) {
    console.log(error);
  }
}
