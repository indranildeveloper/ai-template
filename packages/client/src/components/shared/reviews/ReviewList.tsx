import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type FC } from "react";
import { HiSparkles } from "react-icons/hi2";
import ReviewSkeleton from "./ReviewSkeleton";
import StarRating from "./StarRating";
import {
    reviewsApi,
    type IGetReviewsResponse,
    type ISummarizeResponse,
} from "./reviewsApi";

interface ReviewListProps {
    productId: number;
}

const ReviewList: FC<ReviewListProps> = ({ productId }) => {
    const reviewsQuery = useQuery<IGetReviewsResponse>({
        queryKey: ["reviews", productId],
        queryFn: () => reviewsApi.fetchReviews(productId),
    });

    const summaryMutation = useMutation<ISummarizeResponse>({
        mutationFn: () => reviewsApi.summarizeReviews(productId),
    });

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
