import OpenAI from "openai";
import { conversationRepository } from "../repositories/conversation.repository";
import type { IChatResponse } from "../types/chat";

// Implementation detail
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL,
});

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
            model: "openai/gpt-oss-safeguard-20b",
            input: messages,
            temperature: 0.2,
            max_output_tokens: 100,
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
