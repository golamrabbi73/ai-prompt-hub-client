import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FiStar } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const ReviewForm = ({ promptId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return toast.error("Please write a comment");
    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, {
        promptId,
        reviewerName: user.displayName,
        reviewerEmail: user.email,
        rating,
        comment,
      });
      toast.success("Review submitted");
      setComment("");
      setRating(5);
      queryClient.invalidateQueries(["reviews", promptId]);
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-5 border border-base-300 bg-base-200 p-5">
      <p className="font-mono text-[11px] uppercase tracking-wider text-base-content/50">
        Leave a review
      </p>

      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onClick={() => setRating(star)}>
            <FiStar
              size={22}
              className={
                star <= rating
                  ? "fill-secondary text-secondary"
                  : "text-base-300"
              }
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review…"
        rows={3}
        className="mt-3 w-full border border-base-300 bg-base-100 p-3 text-sm outline-none"
      />

      <button
        onClick={handleSubmit}
        disabled={submitting || !comment.trim()}
        className="btn btn-primary btn-sm mt-3"
      >
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
};

export default ReviewForm;