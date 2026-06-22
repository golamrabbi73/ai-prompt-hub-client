// src/pages/PromptDetails/PromptDetails.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiCopy, FiBookmark, FiFlag,
  FiLock, FiCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import usePremium from "../../hooks/usePremium";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ReportModal from "../../components/prompts/ReportModal";
import ReviewForm from "../../components/prompts/ReviewForm";
import ReviewList from "../../components/prompts/ReviewList";

const DIFFICULTY_COLOR = {
  Beginner: "text-success border-success",
  Intermediate: "text-warning border-warning",
  Pro: "text-accent border-accent",
};

const PromptDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { isPremium: isPremiumUser, isLoading: premiumLoading } = usePremium();

  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Fetch prompt — public route, plain axios ঠিক আছে
  const { data: prompt, isLoading } = useQuery({
    queryKey: ["prompt", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/prompts/${id}`
      );
      return res.data;
    },
  });

  // Fetch reviews — public route, plain axios ঠিক আছে
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/reviews/${id}`
      );
      return res.data;
    },
  });

  // Fetch bookmark status — protected, axiosSecure
  useQuery({
    queryKey: ["bookmark", user?.email, id],
    enabled: !!user,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookmarks/check/${user.email}/${id}`
      );
      setBookmarked(res.data.bookmarked);
      return res.data;
    },
  });

  // Copy prompt — protected, axiosSecure
  const handleCopy = async () => {
    if (!user) return navigate("/login");
    if (isPrivate && !isPremiumUser) return;
    await navigator.clipboard.writeText(prompt.content);
    await axiosSecure.patch(`/prompts/${id}/copy`);
    setCopied(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
    queryClient.invalidateQueries(["prompt", id]);
  };

  // Bookmark toggle — protected, axiosSecure
  const handleBookmark = async () => {
    if (!user) return navigate("/login");
    const res = await axiosSecure.post(`/bookmarks`, {
      userEmail: user.email,
      promptId: id,
    });
    setBookmarked(res.data.bookmarked);
    toast.success(res.data.message);
  };

  if (isLoading || premiumLoading) {
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
                Upgrade to unlock this prompt.
              </p>
              <button
                onClick={() => navigate("/payment")}
                className="btn btn-accent btn-sm"
              >
                Upgrade to Premium — $5
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

        {user && !(isPrivate && !isPremiumUser) && (
          <ReviewForm promptId={id} />
        )}

        <div className="mt-5">
          <ReviewList reviews={reviews} />
        </div>
      </div>

      {/* ReportModal */}
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