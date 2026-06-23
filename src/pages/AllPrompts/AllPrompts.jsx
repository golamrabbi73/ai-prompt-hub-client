import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiCopy,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiLock,
} from "react-icons/fi";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const CATEGORIES = [
  "Writing", "Coding", "Marketing", "Design",
  "Education", "Business", "Creative", "Research",
];

const AI_TOOLS = [
  "ChatGPT", "Gemini", "Claude", "Midjourney",
  "Stable Diffusion", "Copilot",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Pro"];
const SORTS = [
  { label: "Latest", value: "latest" },
  { label: "Most Copied", value: "mostCopied" },
  { label: "Most Popular", value: "mostPopular" },
];

const DIFFICULTY_COLOR = {
  Beginner: "text-success border-success",
  Intermediate: "text-warning border-warning",
  Pro: "text-accent border-accent",
};

const AllPrompts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [aiTool, setAiTool] = useState(searchParams.get("aiTool") || "");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["allPrompts", search, category, aiTool, difficulty, sort, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        search,
        category,
        aiTool,
        difficulty,
        sort,
        page,
        limit: 9,
      });
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/prompts?${params}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const prompts = data?.prompts || [];
  const totalPages = data?.totalPages || 1;

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleFilter = (key, value) => {
    setPage(1);
    if (key === "category") setCategory(value);
    if (key === "aiTool") setAiTool(value);
    if (key === "difficulty") setDifficulty(value);
    if (key === "sort") setSort(value);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setAiTool("");
    setDifficulty("");
    setSort("latest");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Page header */}
      <div className="border-b border-base-300 bg-base-200 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-secondary">
            Browse
          </span>
          <h1 className="mt-1 font-display text-3xl font-semibold text-base-content">
            All Prompts
          </h1>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="mt-5 flex max-w-xl items-center border border-base-300 bg-base-100 px-4 py-2.5"
          >
            <FiSearch className="shrink-0 text-base-content/40" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, tag, or AI tool…"
              className="mx-3 flex-1 bg-transparent text-sm outline-none"
            />
            <button type="submit" className="btn btn-primary btn-xs">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar filters */}
          <aside className="w-full shrink-0 lg:w-56">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-base-content/50">
                <FiFilter size={12} /> Filters
              </span>
              <button
                onClick={clearFilters}
                className="font-mono text-[10px] text-secondary hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Category */}
            <div className="mt-5">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-base-content/40">
                Category
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() =>
                      handleFilter("category", category === c ? "" : c)
                    }
                    className={`rounded-full border px-3 py-1 font-mono text-[10px] transition-colors ${
                      category === c
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-base-300 text-base-content/60 hover:border-secondary"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Tool */}
            <div className="mt-5">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-base-content/40">
                AI Tool
              </p>
              <div className="flex flex-wrap gap-1.5">
                {AI_TOOLS.map((t) => (
                  <button
                    key={t}
                    onClick={() =>
                      handleFilter("aiTool", aiTool === t ? "" : t)
                    }
                    className={`rounded-full border px-3 py-1 font-mono text-[10px] transition-colors ${
                      aiTool === t
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-base-300 text-base-content/60 hover:border-secondary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="mt-5">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-base-content/40">
                Difficulty
              </p>
              <div className="flex flex-wrap gap-1.5">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() =>
                      handleFilter("difficulty", difficulty === d ? "" : d)
                    }
                    className={`rounded-full border px-3 py-1 font-mono text-[10px] transition-colors ${
                      difficulty === d
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-base-300 text-base-content/60 hover:border-secondary"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mt-5">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-base-content/40">
                Sort by
              </p>
              <div className="flex flex-col gap-1.5">
                {SORTS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => handleFilter("sort", s.value)}
                    className={`rounded-sm border px-3 py-1.5 text-left font-mono text-[10px] transition-colors ${
                      sort === s.value
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-base-300 text-base-content/60 hover:border-secondary"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Prompt grid */}
          <div className="flex-1">
            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="h-52 animate-pulse rounded-sm bg-base-200"
                  />
                ))}
              </div>
            )}

            {/* Empty */}
            {!isLoading && prompts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-display text-xl text-base-content/40">
                  No prompts found
                </p>
                <p className="mt-2 text-sm text-base-content/30">
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn btn-outline border-base-300 btn-sm mt-4"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Cards */}
            {!isLoading && prompts.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {prompts.map((prompt, i) => (
                    <motion.div
  key={prompt._id}
  initial={{ opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, delay: i * 0.05 }}
  className="flex flex-col border border-base-300 bg-base-200 p-5"
>
  {/* Top row */}
  <div className="flex items-start justify-between gap-2">
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

  {/* Title — always visible */}
  <h3 className="mt-3 font-display text-base font-semibold leading-snug text-base-content">
    {prompt.title}
  </h3>

  {/* Premium lock — blur everything below title */}
  {prompt.visibility === "private" ? (
    <div className="mt-2 flex flex-1 flex-col items-center justify-center gap-2 rounded-sm border border-accent/20 bg-accent/5 py-6 text-center">
      <FiLock size={18} className="text-accent/50" />
      <p className="font-mono text-[10px] uppercase tracking-wider text-accent/60">
        Premium Prompt
      </p>
      <p className="text-xs text-base-content/40">
        Subscribe to unlock
      </p>
    </div>
  ) : (
    <>
      {/* Description */}
      <p className="mt-1.5 flex-1 text-sm text-base-content/60 line-clamp-2">
        {prompt.description}
      </p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1">
        {prompt.tags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-base-100 px-2.5 py-0.5 font-mono text-[10px] text-base-content/50"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  )}

  {/* Bottom row */}
  <div className="mt-4 flex items-center justify-between">
    <span className="flex items-center gap-1.5 font-mono text-xs text-base-content/40">
      <FiCopy size={11} /> {prompt.copyCount}
    </span>
    <button
      onClick={() =>
        user
          ? navigate(`/prompts/${prompt._id}`)
          : navigate("/login")
      }
      className="flex items-center gap-1 text-sm font-medium text-secondary hover:underline"
    >
      {prompt.visibility === "private" ? (
        <>
          <FiLock size={12} /> Premium
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn btn-outline border-base-300 btn-sm"
                    >
                      <FiChevronLeft size={16} />
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`btn btn-sm ${
                          page === i + 1
                            ? "btn-primary"
                            : "btn-outline border-base-300"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="btn btn-outline border-base-300 btn-sm"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPrompts;