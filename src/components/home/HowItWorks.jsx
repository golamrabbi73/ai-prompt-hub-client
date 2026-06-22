import { motion } from "framer-motion";
import { FiSearch, FiBookmark, FiZap } from "react-icons/fi";

const STEPS = [
  {
    icon: FiSearch,
    step: "01",
    title: "Discover",
    description:
      "Search and filter through hundreds of curated prompts by AI tool, category, or difficulty level.",
  },
  {
    icon: FiBookmark,
    step: "02",
    title: "Save & Copy",
    description:
      "Bookmark your favourites and copy prompts to your clipboard with a single click.",
  },
  {
    icon: FiZap,
    step: "03",
    title: "Create & Share",
    description:
      "Submit your own prompts, get them reviewed, and build your reputation as a top creator.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.1 },
  }),
};

const HowItWorks = () => {
  return (
    <section className="bg-base-200 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-secondary">
            Get started in minutes
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-base-content">
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="relative flex flex-col items-start border border-base-300 bg-base-100 p-8"
            >
              {/* Step number */}
              <span className="font-mono text-5xl font-bold text-base-300 select-none">
                {step.step}
              </span>

              {/* Icon */}
              <div className="mt-4 flex h-10 w-10 items-center justify-center border border-secondary/30 bg-base-200 text-secondary">
                <step.icon size={18} />
              </div>

              <h3 className="mt-4 font-display text-xl font-semibold text-base-content">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/60">
                {step.description}
              </p>

              {/* Connector line (hidden on last) */}
              {i < STEPS.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-base-300 md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;