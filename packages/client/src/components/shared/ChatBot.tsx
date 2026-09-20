import {
    useEffect,
    useRef,
    useState,
    type ClipboardEvent,
    type FC,
    type KeyboardEvent,
} from "react";
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
    const [error, setError] = useState<string>("");
    const conversationId = useRef(crypto.randomUUID());
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const { register, handleSubmit, reset, formState } = useForm<IFormData>();

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async ({ prompt }: IFormData) => {
        try {
            setMessages((prevMessages) => [
                ...prevMessages,
                { content: prompt, role: "user" },
            ]);
            setIsAssistantTyping(true);
            setError("");
            reset({ prompt: "" });
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

    const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    const onCopyMessage = (e: ClipboardEvent) => {
        const selection = window.getSelection()?.toString().trim();
        if (selection) {
            e.preventDefault();
            e.clipboardData.setData("text/plain", selection);
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="mb-10 flex flex-1 flex-col gap-3 overflow-y-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        onCopy={onCopyMessage}
                        ref={
                            index === messages.length - 1
                                ? lastMessageRef
                                : null
                        }
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
                {error && <p className="text-red-500">{error}</p>}
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
                    autoFocus
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
