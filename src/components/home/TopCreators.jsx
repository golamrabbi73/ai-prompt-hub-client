import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiCopy, FiFileText } from "react-icons/fi";
import axios from "axios";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.07 },
  }),
};

const TopCreators = () => {
  const { data: creators = [], isLoading } = useQuery({
    queryKey: ["topCreators"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/top-creators`
      );
      return res.data;
    },
  });

  return (
    <section className="bg-base-200 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-secondary">
            Community
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-base-content">
            Top Creators
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-base-content/60">
            The prompt engineers behind our most popular submissions.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-sm bg-base-300"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && creators.length === 0 && (
          <div className="py-12 text-center text-base-content/40">
            <p className="font-mono text-sm">No creators yet.</p>
          </div>
        )}

        {/* Creator cards */}
        {!isLoading && creators.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {creators.map((creator, i) => (
              <motion.div
                key={creator.email}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="flex flex-col items-center border border-base-300 bg-base-100 p-5 text-center"
              >
                <img
                  src={
                    creator.photoURL ||
                    "https://i.ibb.co/2kR4R7g/default-avatar.png"
                  }
                  alt={creator.name}
                  referrerPolicy="no-referrer"
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-secondary ring-offset-2 ring-offset-base-100"
                />
                <h3 className="mt-3 font-display text-sm font-semibold text-base-content line-clamp-1">
                  {creator.name}
                </h3>
                <div className="mt-2 flex items-center gap-3">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-base-content/50">
                    <FiFileText size={10} /> {creator.totalPrompts}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-base-content/50">
                    <FiCopy size={10} /> {creator.totalCopies}
                  </span>
                </div>
                <span className="mt-2 rounded-full border border-secondary/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-secondary">
                  {creator.role}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopCreators;