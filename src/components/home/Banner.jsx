import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";

const TRENDING_TAGS = [
  "ChatGPT", "Midjourney", "Gemini", "Claude",
  "Copywriting", "Code Review", "SEO", "Storytelling",
];

// Fade-up variant
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay },
  }),
};

const Banner = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/all-prompts?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleTag = (tag) => {
    navigate(`/all-prompts?search=${encodeURIComponent(tag)}`);
  };

  const handleSecondaryCta = () => {
    navigate(user ? "/dashboard" : "/register");
  };

  return (
    <section className="relative overflow-hidden bg-base-100 px-4 py-24 md:py-32">
      {/* Decorative ink blot */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary opacity-10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-accent opacity-10 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Eyebrow label */}
        <motion.span
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-block font-mono text-[11px] uppercase tracking-[0.22em] text-secondary"
        >
          The AI Prompt Marketplace
        </motion.span>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="mt-4 font-display text-4xl font-semibold leading-tight text-base-content md:text-6xl"
        >
          Discover prompts that{" "}
          <span className="italic text-secondary">actually work.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-base-content/60"
        >
          Browse, save, and share battle-tested AI prompts for ChatGPT, Gemini,
          Claude, Midjourney, and more — curated by a growing community of
          creators.
        </motion.p>

        {/* Search bar */}
        <motion.form
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          onSubmit={handleSearch}
          className="mx-auto mt-8 flex max-w-lg items-center border border-base-300 bg-base-200 px-4 py-3 shadow-sm"
        >
          <FiSearch className="shrink-0 text-base-content/40" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts, tools, or tags…"
            className="mx-3 flex-1 bg-transparent text-sm outline-none placeholder:text-base-content/40"
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm gap-1.5"
          >
            Search <FiArrowRight size={14} />
          </button>
        </motion.form>

        {/* Trending tags */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-base-content/40">
            Trending:
          </span>
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTag(tag)}
              className="rounded-full border border-base-300 bg-base-200 px-3 py-1 font-mono text-[11px] text-base-content/70 transition-colors hover:border-secondary hover:text-secondary"
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => navigate("/all-prompts")}
            className="btn btn-primary gap-2"
          >
            Browse all prompts <FiArrowRight size={16} />
          </button>
          <button
            onClick={handleSecondaryCta}
            className="btn btn-outline border-base-300 gap-2"
          >
            {user ? "Go to Dashboard" : "Start for free"}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;