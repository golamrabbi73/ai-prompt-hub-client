import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiStar, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import ConfirmDeleteModal from "../../../components/shared/ConfirmDeleteModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyReviews = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null); // { _id, promptTitle }
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["myReviews", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/user/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await axiosSecure.delete(`/reviews/${deleteTarget._id}`);
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["myReviews", user.email] });
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete review");
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
      <h1 className="font-display text-2xl font-semibold text-base-content">
        My Reviews
      </h1>
      <p className="mt-1 text-sm text-base-content/60">
        Reviews you've submitted across all prompts.
      </p>

      {reviews.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 py-16 text-center">
          <FiStar size={28} className="text-base-content/20" />
          <p className="font-display text-lg text-base-content/40">
            You haven't written any reviews yet.
          </p>
          <Link to="/all-prompts" className="btn btn-primary btn-sm">
            Browse Prompts
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border border-base-300 bg-base-200 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link
                    to={`/prompts/${review.promptId}`}
                    className="font-display font-semibold text-base-content hover:text-secondary"
                  >
                    {review.promptTitle}
                  </Link>
                  <div className="mt-1 flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={13}
                        className={
                          i < review.rating
                            ? "fill-secondary text-secondary"
                            : "text-base-300"
                        }
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setDeleteTarget({
                      _id: review._id,
                      promptTitle: review.promptTitle,
                    })
                  }
                  className="text-base-content/40 hover:text-accent"
                  title="Delete review"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>

              <p className="mt-1 font-mono text-[10px] text-base-content/40">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 text-sm text-base-content/70">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
            <ConfirmDeleteModal
                heading="Delete Review"
                itemLabel="review"
                title={deleteTarget.promptTitle}
                isDeleting={isDeleting}
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setDeleteTarget(null)}
            />
        )}
    </div>
  );
};

export default MyReviews;