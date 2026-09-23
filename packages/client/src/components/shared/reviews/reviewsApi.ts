import axios from "axios";

interface IReview {
    id: number;
    author: string;
    rating: number;
    content: string;
    createdAt: string;
}

export interface IGetReviewsResponse {
    summary: string | null;
    reviews: IReview[];
}

export interface ISummarizeResponse {
    summary: string;
}

export const reviewsApi = {
    fetchReviews(productId: number) {
        return axios
            .get<IGetReviewsResponse>(`/api/products/${productId}/reviews`)
            .then((res) => res.data);
    },
    summarizeReviews(productId: number) {
        return axios
            .post<ISummarizeResponse>(
                `/api/products/${productId}/reviews/summarize`
            )
            .then((res) => res.data);
    },
};
