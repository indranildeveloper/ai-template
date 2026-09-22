import type { Review } from "../generated/prisma/client";
import { llmClient } from "../llm/client";
import template from "../prompts/summarize-reviews.txt";
import { reviewRepository } from "../repositories/review.repository";

export const reviewService = {
    async getReviews(productId: number): Promise<Review[]> {
        return reviewRepository.getReviews(productId);
    },
    async summarizeReviews(productId: number): Promise<string> {
        const reviews = await reviewRepository.getReviews(productId, 10);

        const joinedReviews = reviews
            .map((review) => review.content)
            .join("\n\n");

        const prompt = template.replace("{{reviews}}", joinedReviews);

        const response = await llmClient.generateText({
            model: "openai/gpt-oss-20b",
            prompt,
            temperature: 0.2,
            maxTokens: 500,
        });

        return response.text;
    },
};
