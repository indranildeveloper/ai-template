import type { Review } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const reviewRepository = {
    async getReviews(productId: number): Promise<Review[]> {
        return prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: "desc" },
        });
    },
};
