// src/pages/Dashboard/Admin/ReportedPrompts.jsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiEye, FiCheck, FiTrash2, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import ConfirmDeleteModal from "../../../components/shared/ConfirmDeleteModal";
// import ConfirmDeleteModal from "../../../components/dashboard/ConfirmDeleteModal";

const STATUS_COLOR = {
  pending: "text-warning border-warning",
  dismissed: "text-success border-success",
  warned: "text-accent border-accent",
};

const ReportedPrompts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [loadingId, setLoadingId] = useState(null);

  // ConfirmDeleteModal-এর জন্য state
  const [deleteTarget, setDeleteTarget] = useState(null);
  // { reportId, promptId } দুটোই রাখবো
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["allReports"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reports");
      return res.data;
    },
  });

  // Dismiss / Warn
  const handleStatusChange = async (id, status) => {
    setLoadingId(id);
    try {
      await axiosSecure.patch(`/reports/${id}`, { status });
      toast.success(
        status === "dismissed"
          ? "Report dismissed — no action taken."
          : "Creator has been warned."
      );
      queryClient.invalidateQueries({ queryKey: ["allReports"] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update report");
    } finally {
      setLoadingId(null);
    }
  };

  // Modal confirm — prompt delete করা
  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await axiosSecure.delete(`/prompts/${deleteTarget.promptId}`);
      await axiosSecure.patch(`/reports/${deleteTarget.reportId}`, {
        status: "dismissed",
      });
      toast.success("Prompt removed successfully.");
      queryClient.invalidateQueries({ queryKey: ["allReports"] });
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove prompt");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

  const counts = {
    all: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    dismissed: reports.filter((r) => r.status === "dismissed").length,
    warned: reports.filter((r) => r.status === "warned").length,
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
        Reported Prompts
      </h1>
      <p className="mt-1 text-sm text-base-content/60">
        Review community reports and take action. Total: {reports.length}
      </p>

      {/* Filter tabs */}
      <div className="mt-5 flex flex-wrap gap-2">
        {["all", "pending", "dismissed", "warned"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
              filter === tab
                ? "border-secondary bg-secondary/10 text-secondary"
                : "border-base-300 text-base-content/50 hover:border-secondary/50"
            }`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto border border-base-300">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-base-300 bg-base-200">
            <tr>
              {[
                "Prompt ID",
                "Reported By",
                "Reason",
                "Description",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-base-content/40"
                >
                  No reports found.
                </td>
              </tr>
            ) : (
              filtered.map((report) => (
                <tr
                  key={report._id}
                  className="border-b border-base-300 last:border-0 hover:bg-base-200/50"
                >
                  {/* Prompt ID */}
                  <td className="px-4 py-3 font-mono text-xs text-base-content/60">
                    {report.promptId?.slice(-8) || "—"}
                  </td>

                  {/* Reporter */}
                  <td className="px-4 py-3 font-mono text-xs text-base-content/60">
                    {report.reporterEmail || "—"}
                  </td>

                  {/* Reason */}
                  <td className="px-4 py-3">
                    <span className="border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">
                      {report.reason || "—"}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="max-w-xs px-4 py-3 text-xs text-base-content/60">
                    <p className="line-clamp-2">
                      {report.description || "No details provided."}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                        STATUS_COLOR[report.status] ||
                        "border-base-300 text-base-content/50"
                      }`}
                    >
                      {report.status || "pending"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    {loadingId === report._id ? (
                      <span className="loading loading-spinner loading-xs text-secondary" />
                    ) : (
                      <div className="flex items-center gap-3">
                        {/* View prompt */}
                        {report.promptId && (
                          <Link
                            to={`/prompts/${report.promptId}`}
                            target="_blank"
                            className="text-base-content/40 hover:text-secondary"
                            title="View prompt"
                          >
                            <FiEye size={15} />
                          </Link>
                        )}

                        {/* Dismiss */}
                        {report.status !== "dismissed" && (
                          <button
                            onClick={() =>
                              handleStatusChange(report._id, "dismissed")
                            }
                            className="text-base-content/40 hover:text-success"
                            title="Dismiss — not harmful"
                          >
                            <FiCheck size={15} />
                          </button>
                        )}

                        {/* Warn creator */}
                        {report.status !== "warned" && (
                          <button
                            onClick={() =>
                              handleStatusChange(report._id, "warned")
                            }
                            className="text-base-content/40 hover:text-warning"
                            title="Warn creator"
                          >
                            <FiX size={15} />
                          </button>
                        )}

                        {/* Remove prompt — modal দিয়ে */}
                        {report.promptId && (
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                reportId: report._id,
                                promptId: report.promptId,
                              })
                            }
                            className="text-base-content/40 hover:text-accent"
                            title="Remove prompt"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          heading="Remove Prompt"
          itemLabel="prompt"
          title={`Prompt ID: ...${deleteTarget.promptId.slice(-12)}`}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default ReportedPrompts;