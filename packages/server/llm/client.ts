import { InferenceClient } from "@huggingface/inference";
import { Ollama } from "ollama";
import OpenAI from "openai";
import type { IMessage } from "../types/chat";
import summarizePrompt from "./prompts/summarize-reviews.txt";

const openAIClient = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL,
});

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

const ollamaClient = new Ollama();

interface IGenerateTextOptions {
    model?: string;
    prompt: string | IMessage[];
    temperature?: number;
    maxTokens?: number;
    instructions?: string;
}

interface IGenerateTextResult {
    id: string;
    text: string;
}

export const llmClient = {
    async generateText({
        model = "openai/gpt-oss-20b",
        prompt,
        temperature = 0.2,
        maxTokens = 300,
        instructions,
    }: IGenerateTextOptions): Promise<IGenerateTextResult> {
        const response = await openAIClient.responses.create({
            model,
            input: prompt,
            instructions,
            temperature,
            max_output_tokens: maxTokens,
        });

        return {
            id: response.id,
            text: response.output_text,
        };
    },
    async summarizeReviews(reviews: string) {
        const response = await ollamaClient.chat({
            model: "tinyllama",
            messages: [
                { role: "system", content: summarizePrompt },
                {
                    role: "user",
                    content: reviews,
                },
            ],
        });

        return response.message.content;
    },
};
