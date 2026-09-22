import express, { type Request, type Response } from "express";
import { chatController } from "../controllers/chat.controller";
import { prisma } from "../lib/prisma";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

router.get("/api/hello", (req: Request, res: Response) => {
    res.json({ message: "Hello World." });
});

router.post("/api/chat", chatController.sendMessage);

router.get("/api/products/:id/reviews", async (req: Request, res: Response) => {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
        res.status(400).json({ error: "Invalid product ID." });
        return;
    }

    const reviews = await prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
    });

    res.status(200).json(reviews);
});

export default router;
