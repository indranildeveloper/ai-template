import axios from "axios";
import { useEffect, useState, type FC } from "react";
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

    const fetchReviews = async () => {
        const { data } = await axios.get<IGetReviewsResponse>(
            `/api/products/${productId}/reviews`
        );
        setReviewData(data);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchReviews();
    }, []);

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
