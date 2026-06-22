import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const REASONS = [
  "Inappropriate Content",
  "Spam",
  "Copyright Violation",
  "Misleading Information",
  "Other",
];

const ReportModal = ({ promptId, onClose }) => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reports`, {
        promptId,
        reporterEmail: user.email,
        reason: data.reason,
        description: data.description || "",
      });
      toast.success("Report submitted successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit report");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/40 px-4">
      <div className="w-full max-w-md border border-base-300 bg-base-100 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-base-content">
            Report Prompt
          </h2>
          <button
            onClick={onClose}
            className="text-base-content/40 hover:text-base-content"
          >
            <FiX size={20} />
          </button>
        </div>

        <p className="mt-1 text-sm text-base-content/60">
          Help us keep Promptarium safe and high quality.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
              Reason
            </label>
            <select
              {...register("reason", { required: true })}
              className="w-full border border-base-300 bg-base-200 px-3 py-2.5 text-sm outline-none"
            >
              <option value="">Select a reason</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
              Description (optional)
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Provide additional details..."
              className="w-full border border-base-300 bg-base-200 px-3 py-2.5 text-sm outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-sm"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline border-base-300 btn-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;