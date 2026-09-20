export interface IMessage {
    role: "user" | "assistant";
    content: string;
}

export interface IChatResponse {
    id: string;
    message: string;
}
