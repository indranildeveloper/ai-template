import type { FC } from "react";

interface DotProps {
    className?: string;
}

const Dot: FC<DotProps> = ({ className }) => {
    return (
        <div
            className={`h-2 w-2 animate-pulse rounded-full bg-gray-800 ${className}`}
        />
    );
};
const TypingIndicator: FC = () => {
    return (
        <div className="flex gap-1 self-start rounded-xl bg-gray-200 p-3">
            <Dot />
            <Dot className="[animation-delay:0.2s]" />
            <Dot className="[animation-delay:0.4s]" />
        </div>
    );
};

export default TypingIndicator;
