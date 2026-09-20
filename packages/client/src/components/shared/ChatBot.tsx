import type { FC, KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "../ui/button";

interface IFormData {
    prompt: string;
}

const ChatBot: FC = () => {
    const { register, handleSubmit, reset, formState } = useForm<IFormData>();

    const onSubmit = (data: IFormData) => {
        console.log(data);
        reset();
    };

    const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <form
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
    );
};

export default ChatBot;
