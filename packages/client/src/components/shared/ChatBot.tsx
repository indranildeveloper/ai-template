import { useRef, useState, type FC, type KeyboardEvent } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "../ui/button";

interface IFormData {
    prompt: string;
}

interface IChatResponse {
    message: string;
}

const ChatBot: FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const conversationId = useRef(crypto.randomUUID());
    const { register, handleSubmit, reset, formState } = useForm<IFormData>();

    const onSubmit = async ({ prompt }: IFormData) => {
        setMessages((prevMessages) => [...prevMessages, prompt]);
        reset();
        const { data } = await axios.post<IChatResponse>("/api/chat", {
            prompt,
            conversationId: conversationId.current,
        });
        setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <div>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
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
