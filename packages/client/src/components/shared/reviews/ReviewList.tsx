import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, type FC } from "react";
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
    const [summary, setSummary] = useState<string>("");
    const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
    const [summaryError, setSummaryError] = useState<string>("");

    const {
        data: reviewData,
        isLoading,
        error,
    } = useQuery<IGetReviewsResponse>({
        queryKey: ["reviews", productId],
        queryFn: () => fetchReviews(),
    });

    const handleSummarize = async () => {
        try {
            setIsSummaryLoading(true);
            setSummaryError("");

            const { data } = await axios.post<ISummarizeResponse>(
                `/api/products/${productId}/reviews/summarize`
            );

            setSummary(data.summary);
        } catch (error) {
            console.error("Error: Error while summarizing the text.", error);
            setSummaryError("Could not summarize the reviews, try again.");
        } finally {
            setIsSummaryLoading(false);
        }
    };

    const fetchReviews = async () => {
        const { data } = await axios.get<IGetReviewsResponse>(
            `/api/products/${productId}/reviews`
        );

        return data;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-5">
                {[1, 2, 3].map((placeholder) => (
                    <ReviewSkeleton key={placeholder} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <p className="text-red-500">Could not fetch reviews, Try again.</p>
        );
    }

    if (!reviewData?.reviews.length) {
        return null;
    }

    const currentSummary = reviewData.summary ?? summary;

    return (
        <div>
            <div className="mb-5">
                {currentSummary ? (
                    <p>{currentSummary}</p>
                ) : (
                    <div>
                        <Button
                            onClick={handleSummarize}
                            disabled={isSummaryLoading}
                        >
                            <HiSparkles /> Summarize
                        </Button>
                        {isSummaryLoading && (
                            <div className="py-3">
                                <ReviewSkeleton />
                            </div>
                        )}
                        {summaryError && (
                            <p className="text-red-500">{summaryError}</p>
                        )}
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-5">
                {reviewData?.reviews.map((review) => (
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
