import { useEffect, useRef, type ClipboardEvent, type FC } from "react";
import ReactMarkdown from "react-markdown";

export interface IMessage {
    content: string;
    role: "user" | "assistant";
}

interface ChatMessagesProps {
    messages: IMessage[];
}

const ChatMessages: FC<ChatMessagesProps> = ({ messages }) => {
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onCopyMessage = (e: ClipboardEvent) => {
        const selection = window.getSelection()?.toString().trim();
        if (selection) {
            e.preventDefault();
            e.clipboardData.setData("text/plain", selection);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {messages.map((message, index) => (
                <div
                    key={index}
                    onCopy={onCopyMessage}
                    ref={index === messages.length - 1 ? lastMessageRef : null}
                    className={`rounded-xl px-3 py-1 ${message.role === "user" ? "self-end bg-blue-600 text-white" : "self-start bg-gray-100 text-black"}`}
                >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
            ))}
        </div>
    );
};

export default ChatMessages;
