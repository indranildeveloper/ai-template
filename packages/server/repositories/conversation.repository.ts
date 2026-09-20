import type { IMessage } from "../types/chat";

const conversations = new Map<string, IMessage[]>();

export const conversationRepository = {
    getMessagesByConversationId(conversationId: string) {
        const messages = conversations.get(conversationId) ?? [];
        return messages;
    },
    setMessages(conversationId: string, messages: IMessage[]) {
        conversations.set(conversationId, messages);
    },
};
