import { useQuery } from "@tanstack/react-query";
import { FiX, FiCopy, FiBookmark, FiStar, FiMessageSquare } from "react-icons/fi";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PromptAnalyticsModal = ({ promptId, onClose }) => {
  const axiosSecure = useAxiosSecure();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["promptAnalytics", promptId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/prompts/${promptId}/analytics`);
      return res.data;
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/40 px-4">
      <div className="w-full max-w-sm border border-base-300 bg-base-100 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-base-content">
            Prompt Analytics
          </h2>
          <button
            onClick={onClose}
            className="text-base-content/40 hover:text-base-content"
          >
            <FiX size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner text-secondary" />
          </div>
        ) : (
          <>
            <p className="mt-1 truncate text-sm text-base-content/50">
              {stats?.title}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="border border-base-300 bg-base-200 p-4 text-center">
                <FiCopy size={16} className="mx-auto text-base-content/40" />
                <p className="mt-2 font-display text-2xl font-semibold text-base-content">
                  {stats?.copyCount}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-base-content/40">
                  Copies
                </p>
              </div>

              <div className="border border-base-300 bg-base-200 p-4 text-center">
                <FiBookmark size={16} className="mx-auto text-base-content/40" />
                <p className="mt-2 font-display text-2xl font-semibold text-base-content">
                  {stats?.bookmarkCount}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-base-content/40">
                  Saves
                </p>
              </div>

              <div className="border border-base-300 bg-base-200 p-4 text-center">
                <FiMessageSquare size={16} className="mx-auto text-base-content/40" />
                <p className="mt-2 font-display text-2xl font-semibold text-base-content">
                  {stats?.reviewCount}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-base-content/40">
                  Reviews
                </p>
              </div>

              <div className="border border-base-300 bg-base-200 p-4 text-center">
                <FiStar size={16} className="mx-auto text-base-content/40" />
                <p className="mt-2 font-display text-2xl font-semibold text-base-content">
                  {stats?.avgRating ? stats.avgRating.toFixed(1) : "—"}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-base-content/40">
                  Avg Rating
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PromptAnalyticsModal;