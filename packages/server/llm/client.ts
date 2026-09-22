import OpenAI from "openai";
import type { IMessage } from "../types/chat";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL,
});

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
        const response = await client.responses.create({
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
};
