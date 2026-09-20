import { useRef, useState, type FC, type KeyboardEvent } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useForm } from "react-hook-form";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "../ui/button";

interface IFormData {
    prompt: string;
}

interface IChatResponse {
    message: string;
}

type IMessage = {
    content: string;
    role: "user" | "assistant";
};

const ChatBot: FC = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isAssistantTyping, setIsAssistantTyping] = useState<boolean>(false);
    const conversationId = useRef(crypto.randomUUID());
    const { register, handleSubmit, reset, formState } = useForm<IFormData>();

    const onSubmit = async ({ prompt }: IFormData) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { content: prompt, role: "user" },
        ]);
        setIsAssistantTyping(true);
        reset();
        const { data } = await axios.post<IChatResponse>("/api/chat", {
            prompt,
            conversationId: conversationId.current,
        });
        setMessages((prevMessages) => [
            ...prevMessages,
            { content: data.message, role: "assistant" },
        ]);
        setIsAssistantTyping(false);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <div>
            <div className="mb-10 flex flex-col gap-3">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`rounded-xl px-3 py-1 ${message.role === "user" ? "self-end bg-blue-600 text-white" : "self-start bg-gray-100 text-black"}`}
                    >
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                ))}
                {isAssistantTyping && (
                    <div className="flex gap-1 self-start rounded-xl bg-gray-200 p-3">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-gray-800"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-gray-800 [animation-delay:0.2s]"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-gray-800 [animation-delay:0.4s]"></div>
                    </div>
                )}
            </div>
            <form
                // eslint-disable-next-line react-hooks/refs
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={onKeyDown}
                className="flex flex-col items-end gap-2 rounded-3xl border-2 p-4"
            >
                <textarea
                    {...register("prompt", {
                        required: true,
                        validate: (data) => data.trim().length > 0,
                    })}
                    className="w-full resize-none border-0 focus:outline-0"
                    placeholder="Ask anything"
                    maxLength={1000}
                ></textarea>
                <Button
                    disabled={!formState.isValid}
                    type="submit"
                    className="rounded-full"
                    size="icon"
                >
                    <ArrowUpIcon />
                </Button>
            </form>
        </div>
    );
};

export default ChatBot;
