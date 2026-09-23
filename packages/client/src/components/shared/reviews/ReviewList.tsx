import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type FC } from "react";
import { HiSparkles } from "react-icons/hi2";
import ReviewSkeleton from "./ReviewSkeleton";
import StarRating from "./StarRating";

interface ReviewListProps {
    productId: number;
}

interface IReview {
    id: number;
    author: string;
    rating: number;
    content: string;
    createdAt: string;
}

interface IGetReviewsResponse {
    summary: string | null;
    reviews: IReview[];
}

interface ISummarizeResponse {
    summary: string;
}

const ReviewList: FC<ReviewListProps> = ({ productId }) => {
    const reviewsQuery = useQuery<IGetReviewsResponse>({
        queryKey: ["reviews", productId],
        queryFn: () => fetchReviews(),
    });

    const summaryMutation = useMutation<ISummarizeResponse>({
        mutationFn: () => summarizeReviews(),
    });

    const fetchReviews = async () => {
        const { data } = await axios.get<IGetReviewsResponse>(
            `/api/products/${productId}/reviews`
        );

        return data;
    };

    const summarizeReviews = async () => {
        const { data } = await axios.post<ISummarizeResponse>(
            `/api/products/${productId}/reviews/summarize`
        );

        return data;
    };

    if (reviewsQuery.isLoading) {
        return (
            <div className="flex flex-col gap-5">
                {[1, 2, 3].map((placeholder) => (
                    <ReviewSkeleton key={placeholder} />
                ))}
            </div>
        );
    }

    if (reviewsQuery.isError) {
        return (
            <p className="text-red-500">Could not fetch reviews, Try again.</p>
        );
    }

    if (!reviewsQuery.data?.reviews.length) {
        return null;
    }

    const currentSummary =
        reviewsQuery.data.summary ?? summaryMutation.data?.summary;

    return (
        <div>
            <div className="mb-5">
                {currentSummary ? (
                    <p>{currentSummary}</p>
                ) : (
                    <div>
                        <Button
                            onClick={() => summaryMutation.mutate()}
                            disabled={summaryMutation.isPending}
                        >
                            <HiSparkles /> Summarize
                        </Button>
                        {summaryMutation.isPending && (
                            <div className="py-3">
                                <ReviewSkeleton />
                            </div>
                        )}
                        {summaryMutation.isError && (
                            <p className="text-red-500">
                                Could not summarize reviews. Try again.
                            </p>
                        )}
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-5">
                {reviewsQuery.data?.reviews.map((review) => (
                    <div key={review.id}>
                        <div className="font-semibold">{review.author}</div>
                        <div>
                            <StarRating value={review.rating} />
                        </div>
                        <p className="py-2">{review.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
