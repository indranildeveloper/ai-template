import { llmClient } from "../llm/client";
import template from "../prompts/summarize-reviews.txt";
import { reviewRepository } from "../repositories/review.repository";

export const reviewService = {
    async summarizeReviews(productId: number): Promise<string> {
        const existingSummary =
            await reviewRepository.getReviewSummary(productId);

        if (existingSummary) {
            return existingSummary;
        }

        const reviews = await reviewRepository.getReviews(productId, 10);

        const joinedReviews = reviews
            .map((review) => review.content)
            .join("\n\n");

        const prompt = template.replace("{{reviews}}", joinedReviews);

        const { text: summary } = await llmClient.generateText({
            model: "openai/gpt-oss-20b",
            prompt,
            temperature: 0.2,
            maxTokens: 500,
        });

        await reviewRepository.storeReviewSummary(productId, summary);

        return summary;
    },
};
