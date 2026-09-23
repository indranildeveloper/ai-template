import notificationSound from "@/assets/sounds/notification.mp3";
import popSound from "@/assets/sounds/pop.mp3";
import axios from "axios";
import { useRef, useState, type FC } from "react";
import ChatInput, { type IChatFormData } from "../chat/ChatInput";
import type { IMessage } from "../chat/ChatMessages";
import ChatMessages from "../chat/ChatMessages";
import TypingIndicator from "../chat/TypingIndicator";

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

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
            popAudio.play();
            const { data } = await axios.post<IChatResponse>("/api/chat", {
                prompt,
                conversationId: conversationId.current,
            });
            setMessages((prevMessages) => [
                ...prevMessages,
                { content: data.message, role: "assistant" },
            ]);
            notificationAudio.play();
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
