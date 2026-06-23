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

  const { data: prompt, isLoading } = useQuery({
    queryKey: ["prompt", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/prompts/${id}`
      );
      return res.data;
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/reviews/${id}`
      );
      return res.data;
    },
  });

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
  const isLocked = isPrivate && !isPremiumUser;

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

      {/* Title — always visible */}
      <h1 className="mt-3 font-display text-3xl font-semibold text-base-content md:text-4xl">
        {prompt.title}
      </h1>

      {/* Description + Tags — hidden when locked */}
      {isLocked ? (
        <div className="mt-4 flex items-center gap-2 rounded-sm border border-accent/20 bg-accent/5 px-4 py-3">
          <FiLock size={13} className="shrink-0 text-accent/50" />
          <p className="select-none blur-sm text-base-content/60 line-clamp-2">
            {prompt.description}
          </p>
        </div>
      ) : (
        <>
          <p className="mt-3 text-base leading-relaxed text-base-content/60">
            {prompt.description}
          </p>
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
        </>
      )}

      {/* Action buttons */}
      {user && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            disabled={isLocked}
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

        {isLocked ? (
          <div className="relative mt-3 border border-base-300 bg-base-200 p-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-secondary/30 bg-base-100">
              <FiLock size={26} className="text-secondary" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-base-content">
                Premium Prompt
              </p>
              <p className="mt-1 text-sm text-base-content/60">
                Upgrade to unlock all private prompts.
              </p>
            </div>
            <button
              onClick={() => navigate("/payment")}
              className="btn btn-primary btn-sm px-6"
            >
              Upgrade to Premium — $5
            </button>
          </div>
        ) : (
          <pre className="mt-3 whitespace-pre-wrap rounded-sm border border-base-300 bg-base-200 p-5 font-mono text-sm text-base-content/80">
            {prompt.content}
          </pre>
        )}
      </div>

      {/* Usage instructions */}
      {prompt.usageInstructions && !isLocked && (
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

        {user && !isLocked && (
          <ReviewForm promptId={id} />
        )}

        <div className="mt-5">
          <ReviewList reviews={reviews} />
        </div>
      </div>

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