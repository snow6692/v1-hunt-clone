import { auth } from "@/auth";
import { ActiveProducts as ActiveProductsTypes } from "@/types/productTypes";
import { Comment, Upvote } from "@prisma/client";
import React from "react";
import ProductItem from "./ProductItem";

interface IProps {
  activeProducts: ActiveProductsTypes;
}

async function ActiveProducts({ activeProducts }: IProps) {
  const authenticatedUser = (await auth())?.user;
  const formattedActiveProducts = activeProducts?.map((product) => {
    const {
      id,
      name,
      slug,
      headline,
      description,
      logo,
      releaseDate,
      website,
      twitter,
      discord,
      createdAt,
      updatedAt,
      userId,
      status,
      images,
      categories,
      comments,
      upvotes,
    } = product;

    const imageUrls = images;
    const categoryNames = categories;
    const commentsCount = comments ? comments.length : 0;

    const commentText = comments
      ? comments.map(
          (comment: Comment & { user: { id: string; name: string } }) => ({
            id: comment?.id,
            profile: comment.profilePicture,
            body: comment.body,
            user: comment.user.name,
            timestamp: comment.createdAt,
            userId: comment.user.id,
            name: comment.user.name.toLowerCase().replace(/\s/g, "_"),
          }),
        )
      : [];

    const upvotesData = upvotes ? upvotes : [];

    return {
      id,
      name,
      slug,
      headline,
      description,
      logo,
      releaseDate,
      rank: product.rank || 0,
      website,
      twitter,
      discord,
      createdAt,
      updatedAt,
      userId,
      status,
      images: imageUrls,
      categories: categoryNames,
      commentsLength: commentsCount,
      commentData: commentText,

      upvoters: upvotesData.map(
        (upvote: Upvote & { user: { id: string } }) => upvote.userId,
      ),
      upvotes: upvotesData,
    };
  });

  return (
    <div className="w-full">
      <div className="flex items-center border-b pb-3">
        <h1 className="text-xl font-medium">All Products</h1>
      </div>

      <div className="flex flex-col space-y-2 py-6">
        {formattedActiveProducts?.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            authenticatedUser={authenticatedUser}
          />
        ))}
      </div>
    </div>
  );
}

export default ActiveProducts;
