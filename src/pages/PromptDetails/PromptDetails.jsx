import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiCopy, FiBookmark, FiFlag, FiStar,
  FiLock, FiArrowLeft, FiCheck,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const DIFFICULTY_COLOR = {
  Beginner: "text-success border-success",
  Intermediate: "text-warning border-warning",
  Pro: "text-accent border-accent",
};

const PromptDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

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
    enabled: !!id,
  });

  const isPremiumLocked =
    prompt?.visibility === "private" && !user?.isPremium;

  const handleCopy = async () => {
    if (isPremiumLocked) return;
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    // Increase copy count
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/prompts/${id}/copy`
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = async () => {
    if (!user) return navigate("/login");
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/bookmarks`,
      { userEmail: user.email, promptId: id }
    );
    toast.success(res.data.message);
  };

  const handleReport = () => {
    if (!user) return navigate("/login");
    toast.info("Report modal coming soon");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <p className="font-display text-xl text-base-content/40">
          Prompt not found.
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

  return (
    <div className="min-h-screen bg-base-100 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-mono text-xs text-base-content/50 hover:text-base-content"
        >
          <FiArrowLeft size={13} /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
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
              <h1 className="mt-2 font-display text-2xl font-semibold text-base-content md:text-3xl">
                {prompt.title}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmark}
                className="btn btn-outline border-base-300 btn-sm gap-1.5"
              >
                <FiBookmark size={14} /> Save
              </button>
              <button
                onClick={handleReport}
                className="btn btn-outline border-base-300 btn-sm gap-1.5"
              >
                <FiFlag size={14} /> Report
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="mt-4 leading-relaxed text-base-content/60">
            {prompt.description}
          </p>

          {/* Tags */}
          {prompt.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {prompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-base-200 px-3 py-0.5 font-mono text-[10px] text-base-content/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Prompt content */}
          <div className="relative mt-8 border border-base-300 bg-base-200 p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-base-content/40">
                Prompt Content
              </span>
              {!isPremiumLocked && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 font-mono text-xs text-secondary hover:underline"
                >
                  {copied ? (
                    <><FiCheck size={13} /> Copied!</>
                  ) : (
                    <><FiCopy size={13} /> Copy</>
                  )}
                </button>
              )}
            </div>

            {isPremiumLocked ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <FiLock size={28} className="text-base-content/30" />
                <p className="font-display text-lg font-semibold text-base-content">
                  Premium Prompt
                </p>
                <p className="max-w-xs text-sm text-base-content/50">
                  Subscribe to Premium to unlock this prompt and all other
                  private prompts.
                </p>
                <button
                  onClick={() => navigate("/payment")}
                  className="btn btn-primary btn-sm"
                >
                  Subscribe — $5 one-time
                </button>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-base-content">
                {prompt.content}
              </pre>
            )}
          </div>

          {/* Meta info */}
          <div className="mt-6 flex flex-wrap gap-6 border-t border-base-300 pt-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-base-content/40">
                Creator
              </p>
              <p className="mt-1 text-sm text-base-content">
                {prompt.creatorEmail}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-base-content/40">
                Copies
              </p>
              <p className="mt-1 text-sm text-base-content">
                {prompt.copyCount}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-base-content/40">
                Visibility
              </p>
              <p className="mt-1 text-sm capitalize text-base-content">
                {prompt.visibility}
              </p>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-base-content">
              Reviews
            </h2>

            {reviews.length === 0 ? (
              <p className="mt-4 text-sm text-base-content/40">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border border-base-300 bg-base-200 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-base-content">
                        {review.reviewerName}
                      </p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={13}
                            className={
                              i < review.rating
                                ? "fill-secondary text-secondary"
                                : "text-base-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-base-content/40">
                      {review.reviewerEmail} ·{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-sm text-base-content/70">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PromptDetails;