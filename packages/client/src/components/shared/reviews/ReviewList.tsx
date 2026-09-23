import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type FC } from "react";
import { HiSparkles } from "react-icons/hi2";
import Skeleton from "react-loading-skeleton";
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

const ReviewList: FC<ReviewListProps> = ({ productId }) => {
    const {
        data: reviewData,
        isLoading,
        error,
    } = useQuery<IGetReviewsResponse>({
        queryKey: ["reviews", productId],
        queryFn: () => fetchReviews(),
    });

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
                    <div key={placeholder}>
                        <Skeleton width={150} />
                        <Skeleton width={100} />
                        <Skeleton count={2} />
                    </div>
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

    return (
        <div>
            <div className="mb-5">
                {reviewData?.summary ? (
                    <p>{reviewData.summary}</p>
                ) : (
                    <Button>
                        <HiSparkles /> Summarize
                    </Button>
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
