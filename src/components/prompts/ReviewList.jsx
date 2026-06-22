import { FiStar } from "react-icons/fi";

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        size={13}
        className={
          i < rating ? "fill-secondary text-secondary" : "text-base-300"
        }
      />
    ))}
  </div>
);

const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-base-content/40">
        No reviews yet — be the first!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="border border-base-300 bg-base-200 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-base-content">
                {review.reviewerName}
              </p>
              <p className="font-mono text-[10px] text-base-content/40">
                {review.reviewerEmail}
              </p>
            </div>
            <div className="text-right">
              <StarRating rating={review.rating} />
              <p className="mt-1 font-mono text-[10px] text-base-content/40">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-base-content/70">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;