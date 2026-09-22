import fs from "fs";
import path from "path";
import { llmClient } from "../llm/client";
import template from "../prompts/chatbot.txt";
import { conversationRepository } from "../repositories/conversation.repository";
import type { IChatResponse } from "../types/chat";

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

        const response = await llmClient.generateText({
            model: "openai/gpt-oss-120b",
            instructions,
            prompt: messages,
            temperature: 0.2,
            maxTokens: 200,
        });

        messages.push({
            role: "assistant",
            content: response.text,
        });

        conversationRepository.setMessages(conversationId, messages);

        return {
            id: response.id,
            message: response.text,
        };
    },
};
