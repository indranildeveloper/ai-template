import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL,
});

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.get("/api/hello", (req: Request, res: Response) => {
    res.json({ message: "Hello World." });
});

type Message = {
    role: "user" | "assistant";
    content: string;
};

const conversations = new Map<string, Message[]>();

app.post("/api/chat", async (req: Request, res: Response) => {
    const { prompt, conversationId } = req.body;

    const messages = conversations.get(conversationId) ?? [];

    messages.push({
        role: "user",
        content: prompt,
    });

    const response = await client.responses.create({
        model: "openai/gpt-oss-safeguard-20b",
        input: messages,
        temperature: 0.2,
        max_output_tokens: 100,
    });

    messages.push({
        role: "assistant",
        content: response.output_text,
    });

    conversations.set(conversationId, messages);

    res.json({ message: response.output_text });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
