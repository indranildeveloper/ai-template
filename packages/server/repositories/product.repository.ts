import { prisma } from "../lib/prisma";

export const productRepository = {
    getProduct(productId: number) {
        return prisma.product.findUnique({ where: { id: productId } });
    },
};
