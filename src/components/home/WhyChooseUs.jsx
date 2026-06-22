import { motion } from "framer-motion";
import {
  FiShield,
  FiStar,
  FiUsers,
  FiZap,
  FiBookmark,
  FiTrendingUp,
} from "react-icons/fi";

const FEATURES = [
  {
    icon: FiStar,
    title: "Curated Quality",
    description:
      "Every prompt is reviewed by our admin team before going live — no spam, no low-effort submissions.",
  },
  {
    icon: FiShield,
    title: "Secure & Private",
    description:
      "JWT-based authentication and role-based access control keep your account and prompts safe.",
  },
  {
    icon: FiUsers,
    title: "Community Driven",
    description:
      "Real creators share prompts they actually use. Ratings and reviews help you find what works.",
  },
  {
    icon: FiZap,
    title: "Multi-Tool Support",
    description:
      "Prompts for ChatGPT, Gemini, Claude, Midjourney, Stable Diffusion, and more — all in one place.",
  },
  {
    icon: FiBookmark,
    title: "Save & Organise",
    description:
      "Bookmark your favourite prompts and access them anytime from your personal dashboard.",
  },
  {
    icon: FiTrendingUp,
    title: "Trending Insights",
    description:
      "Discover what the community is copying and rating most — stay ahead of the prompt curve.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.07 },
  }),
};

const WhyChooseUs = () => {
  return (
    <section className="bg-base-100 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-secondary">
            Why Promptarium
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-base-content">
            Built for serious prompt engineers
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-base-content/60">
            We built Promptarium because great prompts deserve a proper home —
            not a buried Reddit thread or a messy Notion doc.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="border border-base-300 bg-base-200 p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center border border-secondary/30 bg-base-100 text-secondary">
                <feature.icon size={18} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-base-content">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;