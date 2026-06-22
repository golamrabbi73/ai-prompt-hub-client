// src/pages/Dashboard/User/SavedPrompts.jsx
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCopy, FiBookmark } from "react-icons/fi";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const DIFFICULTY_COLOR = {
  Beginner: "text-success border-success",
  Intermediate: "text-warning border-warning",
  Pro: "text-accent border-accent",
};

const SavedPrompts = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ["savedPrompts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookmarks/full/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleRemove = async (promptId) => {
    try {
      await axiosSecure.post(`/bookmarks`, { userEmail: user.email, promptId });
      toast.success("Removed from saved prompts");
      queryClient.invalidateQueries({
        queryKey: ["savedPrompts", user.email],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove bookmark");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-base-content">
        Saved Prompts
      </h1>
      <p className="mt-1 text-sm text-base-content/60">
        Prompts you've bookmarked for later.
      </p>

      {prompts.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 py-16 text-center">
          <FiBookmark size={28} className="text-base-content/20" />
          <p className="font-display text-lg text-base-content/40">
            No saved prompts yet.
          </p>
          <Link to="/all-prompts" className="btn btn-primary btn-sm">
            Browse Prompts
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <div
              key={prompt._id}
              className="flex flex-col border border-base-300 bg-base-200 p-5"
            >
              <div className="flex items-start justify-between gap-2">
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
              </div>

              <h3 className="mt-3 font-display text-base font-semibold leading-snug text-base-content">
                {prompt.title}
              </h3>

              <p className="mt-1.5 flex-1 text-sm text-base-content/60 line-clamp-2">
                {prompt.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-xs text-base-content/40">
                  <FiCopy size={11} /> {prompt.copyCount || 0}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleRemove(prompt._id)}
                    className="text-xs text-accent hover:underline"
                  >
                    Remove
                  </button>
                  <Link
                    to={`/prompts/${prompt._id}`}
                    className="flex items-center gap-1 text-sm font-medium text-secondary hover:underline"
                  >
                    View <FiArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPrompts;