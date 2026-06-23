import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import axios from "axios";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.08 },
  }),
};

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        size={13}
        className={
          i < rating ? "fill-secondary text-secondary" : "text-base-300"
        }
      />
    ))}
  </div>
);

// Static fallback
const FALLBACK_REVIEWS = [
  {
    _id: "f1",
    reviewerName: "Sarah K.",
    reviewerEmail: "sarah@example.com",
    rating: 5,
    comment:
      "Promptarium completely changed how I use ChatGPT. The quality of prompts here is miles ahead of anything I found on Reddit.",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "f2",
    reviewerName: "James T.",
    reviewerEmail: "james@example.com",
    rating: 5,
    comment:
      "Finally a place where I can save and organise my favourite prompts. The bookmark feature alone is worth signing up for.",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "f3",
    reviewerName: "Ayesha R.",
    reviewerEmail: "ayesha@example.com",
    rating: 4,
    comment:
      "Love the clean design and the curation process. Every prompt I've tried from here has actually worked.",
    createdAt: new Date().toISOString(),
  },
];

const CustomerReviews = () => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["homeReviews"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/reviews/latest`
      );
      return res.data;
    },
  });

  const displayReviews =
    reviews.length > 0 ? reviews.slice(0, 6) : FALLBACK_REVIEWS;

  return (
    <section className="bg-base-100 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-secondary">
            Testimonials
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-base-content">
            What creators are saying
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-base-content/60">
            Real reviews from the Promptarium community.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-sm bg-base-200"
              />
            ))}
          </div>
        )}

        {/* Review cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayReviews.map((review, i) => (
              <motion.div
                key={review._id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="flex flex-col border border-base-300 bg-base-200 p-6"
              >
                <StarRating rating={review.rating} />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-base-content/70">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-base-300 pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-display text-sm font-semibold text-base-100">
                    {review.reviewerName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-base-content">
                      {review.reviewerName}
                    </p>
                    <p className="font-mono text-[10px] text-base-content/40">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerReviews;