import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiCheck, FiX, FiEye } from "react-icons/fi";
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

  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ["adminAllPrompts"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/prompts/admin/all`);
      return res.data;
    },
  });

  const handleStatusChange = async (id, status) => {
    try {
      await axiosSecure.patch(`/prompts/${id}/status`, { status });
      toast.success(
        status === "approved" ? "Prompt approved!" : "Prompt rejected."
      );
      queryClient.invalidateQueries({ queryKey: ["adminAllPrompts"] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
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
        Review, approve, or reject submitted prompts. Total: {prompts.length}
      </p>

      {/* Filter tabs */}
      <div className="mt-5 flex gap-2">
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
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                Title
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                Creator
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                Category
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                Status
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-base-content/40"
                >
                  No prompts found.
                </td>
              </tr>
            ) : (
              filtered.map((prompt) => (
                <tr
                  key={prompt._id}
                  className="border-b border-base-300 last:border-0 hover:bg-base-200/50"
                >
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-base-content">
                    {prompt.title}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-base-content/70">
                        {prompt.creatorName || "—"}
                      </p>
                      <p className="font-mono text-[10px] text-base-content/40">
                        {prompt.creatorEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-base-content/60">
                    {prompt.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                        STATUS_COLOR[prompt.status] ||
                        "border-base-300 text-base-content/50"
                      }`}
                    >
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
                          onClick={() =>
                            handleStatusChange(prompt._id, "approved")
                          }
                          className="text-base-content/40 hover:text-success"
                          title="Approve"
                        >
                          <FiCheck size={15} />
                        </button>
                      )}
                      {prompt.status !== "rejected" && (
                        <button
                          onClick={() =>
                            handleStatusChange(prompt._id, "rejected")
                          }
                          className="text-base-content/40 hover:text-accent"
                          title="Reject"
                        >
                          <FiX size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPromptsAdmin;