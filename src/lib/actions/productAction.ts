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

export async function getActiveProducts() {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      categories: true,
      images: true,
      comments: {
        include: {
          user: true,
        },
      },
      upvotes: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      upvotes: {
        _count: "desc",
      },
    },
  });

  return products;
}

export async function upvoteProduct(productId: string) {
  try {
    const authenticatedUser = await auth();
    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }
    const userId = authenticatedUser.user.id;
    const upvote = await prisma.upvote.findFirst({
      where: {
        productId,
        userId,
      },
    });
    const profilePicture = authenticatedUser.user.image || "";
    if (upvote) {
      await prisma.upvote.delete({
        where: {
          id: upvote.id,
        },
      });
    } else {
      await prisma.upvote.create({
        data: {
          productId,
          userId,
        },
      });
    }

    const productOwner = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        userId: true,
      },
    });
    // notify the product owner about the upvote
    if (productOwner && productOwner.userId !== userId) {
      await prisma.notification.create({
        data: {
          userId: productOwner.userId,
          body: `Upvoted your product`,
          profilePicture: profilePicture,
          productId: productId,
          type: "UPVOTE",
          status: "UNREAD",
        },
      });
    }
    return true;
  } catch (error) {
    console.error("Error upvoting product:", error);
    throw error;
  }
}

export async function commentOnProduct(
  productId: string | undefined,
  commentText: string,
) {
  try {
    const authenticatedUser = await auth();
    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }
    const userId = authenticatedUser.user.id;
    const profilePicture = authenticatedUser.user.image || "";
    await prisma.comment.create({
      data: {
        createdAt: new Date(),
        productId: productId!,
        userId,
        body: commentText,
        profilePicture: profilePicture,
      },
      include: {
        user: true,
      },
    });
    const productDetails = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        userId: true,
        name: true, // Include the product name in the query
      },
    });
    // Check if the commenter is not the owner of the product
    if (productDetails && productDetails.userId !== userId) {
      // Notify the product owner about the comment
      await prisma.notification.create({
        data: {
          userId: productDetails.userId,
          body: `Commented on your product "${productDetails.name}"`,
          profilePicture: profilePicture,
          productId: productId!,
          type: "COMMENT",
          status: "UNREAD",
          // Ensure commentId is included here
        },
      });
    }
  } catch (error) {
    console.error("Error commenting on product:", error);
    throw error;
  }
}

export const deleteComment = async (commentId: string) => {
  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
