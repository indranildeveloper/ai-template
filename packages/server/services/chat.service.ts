import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { conversationRepository } from "../repositories/conversation.repository";
import type { IChatResponse } from "../types/chat";
import template from "../prompts/chatbot.txt";

// Implementation detail
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL,
});

const parkInfo = fs.readFileSync(
    path.join(__dirname, "..", "prompts", "WonderWorld.md"),
    "utf-8"
);

const instructions = template.replace("{{parkInfo}}", parkInfo);

export const chatService = {
    async sendMessage(
        prompt: string,
        conversationId: string
    ): Promise<IChatResponse> {
        const messages =
            conversationRepository.getMessagesByConversationId(conversationId);

        messages.push({
            role: "user",
            content: prompt,
        });

        const response = await client.responses.create({
            model: "openai/gpt-oss-120b",
            instructions,
            input: messages,
            temperature: 0.2,
            max_output_tokens: 200,
        });

        messages.push({
            role: "assistant",
            content: response.output_text,
        });

        conversationRepository.setMessages(conversationId, messages);

        return {
            id: response.id,
            message: response.output_text,
        };
    },
};
