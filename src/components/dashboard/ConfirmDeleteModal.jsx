import { FiAlertTriangle, FiX } from "react-icons/fi";

const ConfirmDeleteModal = ({ title, onConfirm, onCancel, isDeleting }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/40 px-4">
      <div className="w-full max-w-sm border border-base-300 bg-base-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiAlertTriangle size={18} className="text-accent" />
            <h2 className="font-display text-lg font-semibold text-base-content">
              Delete Prompt
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-base-content/40 hover:text-base-content"
          >
            <FiX size={20} />
          </button>
        </div>

        <p className="mt-3 text-sm text-base-content/60">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-base-content">"{title}"</span>?
          This action cannot be undone.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn btn-sm bg-accent text-white hover:bg-accent/90 border-none"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onCancel}
            className="btn btn-outline border-base-300 btn-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;