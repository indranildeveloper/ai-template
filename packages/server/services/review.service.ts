import OpenAI from "openai";
import type { Review } from "../generated/prisma/client";
import { reviewRepository } from "../repositories/review.repository";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL,
});

export const reviewService = {
    async getReviews(productId: number): Promise<Review[]> {
        return reviewRepository.getReviews(productId);
    },
    async summarizeReviews(productId: number): Promise<string> {
        const reviews = await reviewRepository.getReviews(productId, 10);
        const joinedReviews = reviews
            .map((review) => review.content)
            .join("\n\n");
        const prompt = `
            Summarize the following customer reviews into a short paragraph highlighting key themes, both positive and negative:

            ${joinedReviews}
        `;
        const response = await client.responses.create({
            model: "openai/gpt-oss-20b",
            input: prompt,
            temperature: 0.2,
            max_output_tokens: 500,
        });

        return response.output_text;
    },
};
