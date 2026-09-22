import dayjs from "dayjs";
import type { Review } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const reviewRepository = {
    async getReviews(productId: number, limit?: number): Promise<Review[]> {
        return prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    },
    async storeReviewSummary(productId: number, summary: string) {
        const now = new Date();
        const expiresAt = dayjs().add(7, "days").toDate();
        const data = {
            content: summary,
            expiresAt,
            generatedAt: now,
            productId,
        };

        return prisma.summary.upsert({
            where: {
                productId,
            },
            create: data,
            update: data,
        });
    },
    async getReviewSummary(productId: number) {
        return prisma.summary.findUnique({
            where: { productId },
        });
    },
};
