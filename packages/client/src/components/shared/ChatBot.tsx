import { useRef, useState, type FC, type KeyboardEvent } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "../ui/button";
import TypingIndicator from "./TypingIndicator";
import type { IMessage } from "./ChatMessages";
import ChatMessages from "./ChatMessages";

interface IFormData {
    prompt: string;
}

interface IChatResponse {
    message: string;
}

const ChatBot: FC = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isAssistantTyping, setIsAssistantTyping] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const conversationId = useRef(crypto.randomUUID());
    const { register, handleSubmit, reset, formState } = useForm<IFormData>();

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

    return (
        <div className="flex h-full flex-col">
            <div className="mb-10 flex flex-1 flex-col gap-3 overflow-y-auto">
                <ChatMessages messages={messages} />
                {isAssistantTyping && <TypingIndicator />}
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
