import { useRef, useState, type FC } from "react";
import axios from "axios";
import TypingIndicator from "./TypingIndicator";
import type { IMessage } from "./ChatMessages";
import ChatMessages from "./ChatMessages";
import ChatInput, { type IChatFormData } from "./ChatInput";

interface IChatResponse {
    message: string;
}

const ChatBot: FC = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isAssistantTyping, setIsAssistantTyping] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const conversationId = useRef(crypto.randomUUID());

    const onSubmit = async ({ prompt }: IChatFormData) => {
        try {
            setMessages((prevMessages) => [
                ...prevMessages,
                { content: prompt, role: "user" },
            ]);
            setIsAssistantTyping(true);
            setError("");
            const { data } = await axios.post<IChatResponse>("/api/chat", {
                prompt,
                conversationId: conversationId.current,
            });
            setMessages((prevMessages) => [
                ...prevMessages,
                { content: data.message, role: "assistant" },
            ]);
        } catch (error) {
            console.error(error);
            setError("Something went wrong, please try again.");
        } finally {
            setIsAssistantTyping(false);
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="mb-10 flex flex-1 flex-col gap-3 overflow-y-auto">
                <ChatMessages messages={messages} />
                {isAssistantTyping && <TypingIndicator />}
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <ChatInput onSubmit={onSubmit} />
        </div>
    );
};

export default ChatBot;
