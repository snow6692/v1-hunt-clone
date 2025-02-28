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
        comments: {
          include: {
            user: true,
          },
        },
        upvotes: true,
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
    revalidatePath("/");
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

export async function upvoteProduct(productId: string | undefined) {
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
          productId: productId!,
          userId,
        },
      });

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
            productId: productId!,
            type: "UPVOTE",
            status: "UNREAD",
          },
        });
      }
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

export const getUpvotedProducts = async () => {
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

    const upvotedProducts = await prisma.upvote.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    return upvotedProducts.map((upvote) => upvote.product);
  } catch (error) {
    console.error("Error getting upvoted products:", error);
    return [];
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        images: true,
        categories: true,
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
    });
    return product;
  } catch (error) {
    console.error("Error getting product by slug:", error);
    return null;
  }
};

export const getProductsByCategoryName = async (category: string) => {
  const products = await prisma.product.findMany({
    where: {
      categories: {
        some: {
          name: category,
        },
      },
      status: "ACTIVE",
    },
  });
  return products;
};

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    where: {
      products: {
        some: {
          status: "ACTIVE",
        },
      },
    },
  });

  return categories;
};

export const getRankById = async (): Promise<
  {
    id: string;
    name: string;
    upvotes: { id: string }[];
    rank: number;
  }[]
> => {
  // Fetch products along with their upvote counts from the database
  const rankedProducts = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      upvotes: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      upvotes: {
        _count: "desc", // Order by upvotes count in descending order
      },
    },
  });

  // Find the maximum number of upvotes among all products
  const maxUpvotes =
    rankedProducts.length > 0 ? rankedProducts[0].upvotes.length : 0;

  // Assign ranks to each product based on their number of upvotes
  const productsWithRanks = rankedProducts.map((product, index) => ({
    ...product,
    rank: product.upvotes.length === maxUpvotes ? 1 : index + 2,
  }));

  return productsWithRanks;
};

export const getNotifications = async () => {
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

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (notifications.length === 0) {
      return null;
    }

    return notifications;
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
};

export const deleteAllNotifications = async () => {
  try {
    const authenticatedUser = await auth();

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }
    const userId = authenticatedUser?.user.id;

    await prisma.notification.deleteMany({
      where: { userId },
    });
  } catch (error) {
    console.error("Error While deleting all notifications:", error);

    console.log(error);
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const authenticatedUser = await auth();

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authenticatedUser?.user.id;

    await prisma.notification.updateMany({
      where: {
        userId,
      },
      data: {
        status: "READ",
      },
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

export async function searchProducts(query: string) {
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
      status: "ACTIVE",
    },
  });

  return products;
}
