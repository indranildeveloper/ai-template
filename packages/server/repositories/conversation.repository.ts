type Message = {
    role: "user" | "assistant";
    content: string;
};

const conversations = new Map<string, Message[]>();

export const conversationRepository = {
    getMessagesByConversationId(conversationId: string) {
        const messages = conversations.get(conversationId) ?? [];
        return messages;
    },
    setMessages(conversationId: string, messages: Message[]) {
        conversations.set(conversationId, messages);
    },
};
