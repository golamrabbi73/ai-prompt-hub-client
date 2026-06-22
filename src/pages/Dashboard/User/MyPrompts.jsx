// src/pages/Dashboard/User/MyPrompts.jsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiCopy } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import ConfirmDeleteModal from "../../../components/shared/ConfirmDeleteModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const STATUS_COLOR = {
  pending: "text-warning border-warning",
  approved: "text-success border-success",
  rejected: "text-accent border-accent",
};

const MyPrompts = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null); // { _id, title }
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ["myPrompts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/prompts/user/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await axiosSecure.delete(`/prompts/${deleteTarget._id}`);
      toast.success("Prompt deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["myPrompts", user.email] });
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete prompt");
    } finally {
      setIsDeleting(false);
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-base-content">
          My Prompts
        </h1>
        <Link to="/dashboard/add-prompt" className="btn btn-primary btn-sm">
          + Add New Prompt
        </Link>
      </div>

      {prompts.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 py-16 text-center">
          <p className="font-display text-lg text-base-content/40">
            You haven't submitted any prompts yet.
          </p>
          <Link to="/dashboard/add-prompt" className="btn btn-primary btn-sm">
            Submit your first prompt
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto border border-base-300">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-base-300 bg-base-200">
              <tr>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                  Title
                </th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                  Category
                </th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                  Status
                </th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                  Copies
                </th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {prompts.map((prompt) => (
                <tr
                  key={prompt._id}
                  className="border-b border-base-300 last:border-0 hover:bg-base-200/50"
                >
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-base-content">
                    {prompt.title}
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
                  <td className="px-4 py-3 text-base-content/60">
                    <span className="flex items-center gap-1.5">
                      <FiCopy size={11} /> {prompt.copyCount || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/dashboard/update-prompt/${prompt._id}`}
                        className="text-base-content/50 hover:text-secondary"
                        title="Edit"
                      >
                        <FiEdit2 size={15} />
                      </Link>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            _id: prompt._id,
                            title: prompt.title,
                          })
                        }
                        className="text-base-content/50 hover:text-accent"
                        title="Delete"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          heading="Delete Prompt"
          itemLabel="prompt"
          title={deleteTarget.title}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default MyPrompts;