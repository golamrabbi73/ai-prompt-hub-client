import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import axios from "axios";

const FALLBACK_STATS = [
  { label: "Prompts Published", value: "500+" },
  { label: "Registered Users", value: "1,200+" },
  { label: "Total Copies", value: "8,000+" },
  { label: "AI Tools Covered", value: "10+" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.08 },
  }),
};

const StatsSection = () => {
  const { data } = useQuery({
    queryKey: ["platformStats"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/analytics/stats`
      );
      return res.data;
    },
  });

  const stats = data
    ? [
        { label: "Prompts Published", value: data.totalPrompts },
        { label: "Registered Users", value: data.totalUsers },
        { label: "Total Copies", value: data.totalCopies },
        { label: "Reviews Written", value: data.totalReviews },
      ]
    : FALLBACK_STATS;

  return (
    <section className="bg-primary px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="text-center"
            >
              <p className="font-display text-4xl font-semibold text-primary-content md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-content/60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;