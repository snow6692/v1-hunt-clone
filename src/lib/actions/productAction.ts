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

export async function updateProduct(
  productId: string,
  {
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
  }: ProductData,
) {
  const session = await auth();

  if (!session) {
    throw new Error("You must be signed in to update a product");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name,
      slug,
      headline,
      description,
      logo,
      releaseDate,
      website,
      twitter,
      discord,
      images: {
        deleteMany: {
          productId,
        },
        createMany: {
          data: images.map((image) => ({ url: image })),
        },
      },
      status: "PENDING",
    },
  });
  return product;
}

export const deleteProduct = async (productId: string) => {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    throw new Error("User ID is missing or invalid");
  }

  const userId = session.user.id;

  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product || product.userId !== userId) {
    throw new Error("Product not found or not authorized");
  }

  await prisma.product.delete({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });
  return true;
};

export async function getPendingProducts() {
  const products = await prisma.product.findMany({
    where: { status: "PENDING" },
    include: {
      categories: true,
      images: true,
    },
  });

  return products;
}

export async function activeProduct(productId: string | undefined) {
  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        status: "ACTIVE",
      },
    });

    if (!product) throw new Error("This product not found!");
    await prisma.notification.create({
      data: {
        userId: product.userId,
        body: `Your product ${product.name} has been activated`,
        type: "ACTIVATED",
        status: "UNREAD",
        profilePicture: product.logo,
        productId: product.id,
      },
    });
    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function rejectProduct(
  productId: string | undefined,
  reason: string,
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found or not authorized");
    }
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        status: "REJECTED",
      },
    });

    await prisma.notification.create({
      data: {
        userId: product.userId,
        body: `Your product "${product.name}" has been rejected. Reason: ${reason}`,
        type: "REJECTED",
        status: "UNREAD",
        profilePicture: `${product.logo}`,
        productId: product.id,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
