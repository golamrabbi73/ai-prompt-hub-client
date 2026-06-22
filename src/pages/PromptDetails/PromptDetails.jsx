// src/pages/PromptDetails/PromptDetails.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiCopy, FiBookmark, FiFlag,
  FiLock, FiStar, FiCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import ReportModal from "../../components/prompts/ReportModal";

const DIFFICULTY_COLOR = {
  Beginner: "text-success border-success",
  Intermediate: "text-warning border-warning",
  Pro: "text-accent border-accent",
};

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        size={14}
        className={
          i < rating ? "fill-secondary text-secondary" : "text-base-300"
        }
      />
    ))}
  </div>
);

const PromptDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Fetch prompt
  const { data: prompt, isLoading } = useQuery({
    queryKey: ["prompt", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/prompts/${id}`
      );
      return res.data;
    },
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/reviews/${id}`
      );
      return res.data;
    },
  });

  // Fetch bookmark status
  useQuery({
    queryKey: ["bookmark", user?.email, id],
    enabled: !!user,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookmarks/check/${user.email}/${id}`
      );
      setBookmarked(res.data.bookmarked);
      return res.data;
    },
  });

  // Copy prompt
  const handleCopy = async () => {
    if (!user) return navigate("/login");
    if (isPrivate && !isPremiumUser) return;
    await navigator.clipboard.writeText(prompt.content);
    await axios.patch(`${import.meta.env.VITE_API_URL}/prompts/${id}/copy`);
    setCopied(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
    queryClient.invalidateQueries(["prompt", id]);
  };

  // Bookmark toggle
  const handleBookmark = async () => {
    if (!user) return navigate("/login");
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/bookmarks`,
      { userEmail: user.email, promptId: id }
    );
    setBookmarked(res.data.bookmarked);
    toast.success(res.data.message);
  };

  // Submit review
  const reviewMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, {
        promptId: id,
        reviewerName: user.displayName,
        reviewerEmail: user.email,
        rating: reviewRating,
        comment: reviewComment,
      });
    },
    onSuccess: () => {
      toast.success("Review submitted");
      setReviewComment("");
      setReviewRating(5);
      queryClient.invalidateQueries(["reviews", id]);
    },
    onError: () => toast.error("Failed to submit review"),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="font-display text-xl text-base-content/40">
          Prompt not found
        </p>
        <button
          onClick={() => navigate("/all-prompts")}
          className="btn btn-outline border-base-300 btn-sm"
        >
          Back to All Prompts
        </button>
      </div>
    );
  }

  const isPrivate = prompt.visibility === "private";
  const isPremiumUser = false; // payment milestone-এ connect হবে

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-4xl px-4 py-12"
    >
      {/* Top meta */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
            DIFFICULTY_COLOR[prompt.difficulty] ||
            "border-base-300 text-base-content/50"
          }`}
        >
          {prompt.difficulty}
        </span>
        <span className="font-mono text-[10px] text-base-content/40">
          {prompt.aiTool}
        </span>
        <span className="font-mono text-[10px] text-base-content/40">
          {prompt.category}
        </span>
      </div>

      {/* Title */}
      <h1 className="mt-3 font-display text-3xl font-semibold text-base-content md:text-4xl">
        {prompt.title}
      </h1>

      {/* Description */}
      <p className="mt-3 text-base leading-relaxed text-base-content/60">
        {prompt.description}
      </p>

      {/* Tags */}
      {prompt.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-base-300 px-3 py-1 font-mono text-[10px] text-base-content/50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      {user && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            disabled={isPrivate && !isPremiumUser}
            className="btn btn-primary btn-sm gap-2"
          >
            {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
            {copied ? "Copied!" : `Copy (${prompt.copyCount})`}
          </button>
          <button
            onClick={handleBookmark}
            className={`btn btn-sm gap-2 ${
              bookmarked ? "btn-secondary" : "btn-outline border-base-300"
            }`}
          >
            <FiBookmark size={14} />
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="btn btn-outline border-base-300 btn-sm gap-2 text-error"
          >
            <FiFlag size={14} /> Report
          </button>
        </div>
      )}

      {/* Prompt content */}
      <div className="mt-8">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-base-content/50">
          Prompt Content
        </h2>

        {isPrivate && !isPremiumUser ? (
          <div className="relative mt-3 overflow-hidden border border-base-300 bg-base-200 p-6">
            <p className="select-none blur-sm text-sm text-base-content/60 line-clamp-4">
              {prompt.content}
            </p>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-base-200/80 backdrop-blur-sm">
              <FiLock size={24} className="text-accent" />
              <p className="font-display text-lg font-semibold text-base-content">
                Premium Prompt
              </p>
              <p className="text-sm text-base-content/60">
                Subscribe to unlock this prompt.
              </p>
              <button
                onClick={() => navigate("/payment")}
                className="btn btn-accent btn-sm"
              >
                Subscribe to Premium — $5
              </button>
            </div>
          </div>
        ) : (
          <pre className="mt-3 whitespace-pre-wrap rounded-sm border border-base-300 bg-base-200 p-5 font-mono text-sm text-base-content/80">
            {prompt.content}
          </pre>
        )}
      </div>

      {/* Usage instructions */}
      {prompt.usageInstructions && (
        <div className="mt-6">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-base-content/50">
            Usage Instructions
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-base-content/60">
            {prompt.usageInstructions}
          </p>
        </div>
      )}

      {/* Creator info */}
      <div className="mt-8 border-t border-base-300 pt-6">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-base-content/50">
          Creator
        </h2>
        <p className="mt-2 font-mono text-sm text-base-content/70">
          {prompt.creatorEmail}
        </p>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold text-base-content">
          Reviews ({reviews.length})
        </h2>

        {/* Review form — only if logged in and not premium locked */}
        {user && !(isPrivate && !isPremiumUser) && (
          <div className="mt-5 border border-base-300 bg-base-200 p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-base-content/50">
              Leave a review
            </p>
            <div className="mt-3 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setReviewRating(star)}>
                  <FiStar
                    size={20}
                    className={
                      star <= reviewRating
                        ? "fill-secondary text-secondary"
                        : "text-base-300"
                    }
                  />
                </button>
              ))}
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Write your review…"
              rows={3}
              className="mt-3 w-full border border-base-300 bg-base-100 p-3 text-sm outline-none"
            />
            <button
              onClick={() => reviewMutation.mutate()}
              disabled={!reviewComment || reviewMutation.isPending}
              className="btn btn-primary btn-sm mt-3"
            >
              {reviewMutation.isPending ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        )}

        {/* Review list */}
        <div className="mt-5 space-y-4">
          {reviews.length === 0 && (
            <p className="text-sm text-base-content/40">
              No reviews yet — be the first!
            </p>
          )}
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
              <p className="mt-3 text-sm text-base-content/70">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ReportModal component */}
      {showReportModal && (
        <ReportModal
          promptId={id}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </motion.div>
  );
};

export default PromptDetails;