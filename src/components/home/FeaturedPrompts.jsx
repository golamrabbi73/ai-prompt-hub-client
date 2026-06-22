import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiCopy, FiArrowRight, FiLock } from "react-icons/fi";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.08 },
  }),
};

const DIFFICULTY_COLOR = {
  Beginner: "text-success border-success",
  Intermediate: "text-warning border-warning",
  Pro: "text-accent border-accent",
};

const FeaturedPrompts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["featuredPrompts"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/prompts?limit=6&sort=latest`
      );
      return res.data;
    },
  });

  const prompts = data?.prompts || [];

  const handleViewDetails = (id) => {
    if (!user) return navigate("/login");
    navigate(`/prompts/${id}`);
  };

  return (
    <section className="bg-base-200 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-secondary">
              Hand-picked
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold text-base-content">
              Featured Prompts
            </h2>
          </div>
          <button
            onClick={() => navigate("/all-prompts")}
            className="hidden items-center gap-1.5 text-sm font-medium text-base-content/60 hover:text-base-content md:flex"
          >
            View all <FiArrowRight size={14} />
          </button>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-sm bg-base-300"
              />
            ))}
          </div>
        )}

        {/* Prompt cards */}
        {!isLoading && prompts.length === 0 && (
          <div className="py-16 text-center text-base-content/40">
            <p className="font-mono text-sm">No featured prompts yet.</p>
            <p className="mt-1 text-xs">
              Approve some prompts from the admin dashboard to see them here.
            </p>
          </div>
        )}

        {!isLoading && prompts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt, i) => (
              <motion.div
                key={prompt._id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="flex flex-col border border-base-300 bg-base-100 p-6"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
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

                {/* Title */}
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-base-content">
                  {prompt.title}
                </h3>

                {/* Description */}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-base-content/60 line-clamp-3">
                  {prompt.description}
                </p>

                {/* Tags */}
                {prompt.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {prompt.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-base-200 px-2.5 py-0.5 font-mono text-[10px] text-base-content/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom row */}
                <div className="mt-5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-mono text-xs text-base-content/40">
                    <FiCopy size={12} /> {prompt.copyCount}
                  </span>
                  <button
                    onClick={() => handleViewDetails(prompt._id)}
                    className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline"
                  >
                    {prompt.visibility === "private" && !user ? (
                      <>
                        <FiLock size={13} /> Premium
                      </>
                    ) : (
                      <>
                        View details <FiArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Mobile view all */}
        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => navigate("/all-prompts")}
            className="btn btn-outline border-base-300 btn-sm"
          >
            View all prompts <FiArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrompts;