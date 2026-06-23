import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiCheck, FiX, FiEye, FiTrash2, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const STATUS_COLOR = {
  pending: "text-warning border-warning",
  approved: "text-success border-success",
  rejected: "text-accent border-accent",
};

const AllPromptsAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ["adminAllPrompts"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/prompts/admin/all`);
      return res.data;
    },
  });

  const handleApprove = async (id) => {
    try {
      await axiosSecure.patch(`/prompts/${id}/status`, { status: "approved" });
      toast.success("Prompt approved!");
      queryClient.invalidateQueries({ queryKey: ["adminAllPrompts"] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve prompt");
    }
  };

  const handleToggleFeature = async (prompt) => {
    try {
      await axiosSecure.patch(`/prompts/${prompt._id}/feature`);
      toast.success(prompt.featured ? "Removed from featured" : "Prompt featured!");
      queryClient.invalidateQueries({ queryKey: ["adminAllPrompts"] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle feature");
    }
  };

  const handleRejectConfirmed = async () => {
    if (!rejectTarget) return;
    setIsRejecting(true);
    try {
      await axiosSecure.patch(`/prompts/${rejectTarget.id}/status`, {
        status: "rejected",
        feedback: feedback.trim() || "Your prompt did not meet our guidelines.",
      });
      toast.success("Prompt rejected with feedback.");
      queryClient.invalidateQueries({ queryKey: ["adminAllPrompts"] });
      setRejectTarget(null);
      setFeedback("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject prompt");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await axiosSecure.delete(`/prompts/admin/${deleteTarget.id}`);
      toast.success("Prompt deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminAllPrompts"] });
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete prompt");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered =
    filter === "all" ? prompts : prompts.filter((p) => p.status === filter);

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
        All Prompts
      </h1>
      <p className="mt-1 text-sm text-base-content/60">
        Review, approve, reject, or feature prompts. Total: {prompts.length}
      </p>

      {/* Filter tabs */}
      <div className="mt-5 flex gap-2 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
              filter === f
                ? "border-secondary bg-secondary/10 text-secondary"
                : "border-base-300 text-base-content/50 hover:border-secondary hover:text-secondary"
            }`}
          >
            {f}
            {f !== "all" && (
              <span className="ml-1.5 opacity-60">
                ({prompts.filter((p) => p.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto border border-base-300">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-base-300 bg-base-200">
            <tr>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">Title</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">Creator</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">Category</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">Status</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-base-content/40">
                  No prompts found.
                </td>
              </tr>
            ) : (
              filtered.map((prompt) => (
                <tr
                  key={prompt._id}
                  className="border-b border-base-300 last:border-0 hover:bg-base-200/50"
                >
                  <td className="max-w-xs px-4 py-3 font-medium text-base-content">
                    <p className="truncate">{prompt.title}</p>
                    {prompt.featured && (
                      <span className="mt-0.5 inline-block font-mono text-[9px] text-warning">
                        ★ Featured
                      </span>
                    )}
                    {prompt.status === "rejected" && prompt.rejectionFeedback && (
                      <p className="mt-0.5 text-[10px] text-accent/70 truncate">
                        ↳ {prompt.rejectionFeedback}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-base-content/70">{prompt.creatorName || "—"}</p>
                    <p className="font-mono text-[10px] text-base-content/40">{prompt.creatorEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-base-content/60">{prompt.category}</td>
                  <td className="px-4 py-3">
                    <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS_COLOR[prompt.status] || "border-base-300 text-base-content/50"}`}>
                      {prompt.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/prompts/${prompt._id}`}
                        target="_blank"
                        className="text-base-content/40 hover:text-secondary"
                        title="View"
                      >
                        <FiEye size={15} />
                      </Link>
                      {prompt.status !== "approved" && (
                        <button
                          onClick={() => handleApprove(prompt._id)}
                          className="text-base-content/40 hover:text-success"
                          title="Approve"
                        >
                          <FiCheck size={15} />
                        </button>
                      )}
                      {prompt.status !== "rejected" && (
                        <button
                          onClick={() => setRejectTarget({ id: prompt._id, title: prompt.title })}
                          className="text-base-content/40 hover:text-accent"
                          title="Reject with feedback"
                        >
                          <FiX size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleFeature(prompt)}
                        className={prompt.featured ? "text-warning" : "text-base-content/40 hover:text-warning"}
                        title={prompt.featured ? "Unfeature" : "Feature"}
                      >
                        <FiStar size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: prompt._id, title: prompt.title })}
                        className="text-base-content/40 hover:text-error"
                        title="Delete"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/30 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-base-300 bg-base-100 p-6">
            <h3 className="font-display text-lg font-semibold text-base-content">
              Reject Prompt
            </h3>
            <p className="mt-1 text-sm text-base-content/60">
              Rejecting{" "}
              <span className="font-semibold text-base-content">
                "{rejectTarget.title}"
              </span>
            </p>
            <div className="mt-4">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
                Feedback for creator
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                placeholder="e.g. Content violates guidelines, please revise..."
                className="w-full resize-none border border-base-300 bg-base-200 px-3 py-2.5 text-sm outline-none"
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleRejectConfirmed}
                disabled={isRejecting}
                className="btn btn-sm bg-accent text-white border-none hover:bg-accent/90 flex-1"
              >
                {isRejecting ? "Rejecting..." : "Reject"}
              </button>
              <button
                onClick={() => { setRejectTarget(null); setFeedback(""); }}
                className="btn btn-outline border-base-300 btn-sm flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/30 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-base-300 bg-base-100 p-6">
            <h3 className="font-display text-lg font-semibold text-base-content">
              Delete Prompt
            </h3>
            <p className="mt-2 text-sm text-base-content/60">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-base-content">
                "{deleteTarget.title}"
              </span>? This cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={handleDeleteConfirmed}
                disabled={isDeleting}
                className="btn btn-error btn-sm flex-1"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn btn-outline border-base-300 btn-sm flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPromptsAdmin;