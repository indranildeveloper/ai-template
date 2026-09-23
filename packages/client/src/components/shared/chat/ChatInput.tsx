import { ArrowUpIcon } from "lucide-react";
import type { FC, KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";

export interface IChatFormData {
    prompt: string;
}

interface ChatInputProps {
    onSubmit: (data: IChatFormData) => void;
}

const ChatInput: FC<ChatInputProps> = ({ onSubmit }) => {
    const { register, handleSubmit, reset, formState } =
        useForm<IChatFormData>();

    const handleFormSubmit = handleSubmit((data) => {
        reset({ prompt: "" });
        onSubmit(data);
    });

    const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleFormSubmit();
        }
    };

    return (
        <form
            onSubmit={() => handleFormSubmit()}
            onKeyDown={handleKeyDown}
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
    );
};

export default ChatInput;
