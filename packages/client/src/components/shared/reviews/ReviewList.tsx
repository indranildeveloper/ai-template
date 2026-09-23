import axios from "axios";
import { useEffect, useState, type FC } from "react";
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
    const [reviewData, setReviewData] = useState<IGetReviewsResponse>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchReviews = async () => {
        setIsLoading(true);
        const { data } = await axios.get<IGetReviewsResponse>(
            `/api/products/${productId}/reviews`
        );
        setReviewData(data);
        setIsLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    return (
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
    );
};

export default ReviewList;
