import { motion } from "framer-motion";

const Logo = ({ className = "" }) => {
  return (
    <a href="/" className={`flex items-center gap-2.5 ${className}`}>
      <motion.svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        whileHover={{ scale: 1.08 }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <rect width="34" height="34" rx="9" className="fill-base-300" />

        {/* Connections */}
        <line x1="17" y1="10.5" x2="17" y2="14" stroke="currentColor" strokeOpacity=".25" strokeWidth="1.2" />
        <line x1="20" y1="17" x2="23.5" y2="17" stroke="currentColor" strokeOpacity=".25" strokeWidth="1.2" />
        <line x1="17" y1="20" x2="17" y2="23.5" stroke="currentColor" strokeOpacity=".25" strokeWidth="1.2" />
        <line x1="10.5" y1="17" x2="14" y2="17" stroke="currentColor" strokeOpacity=".25" strokeWidth="1.2" />

        {/* Center */}
        <motion.rect
          x="14"
          y="14"
          width="6"
          height="6"
          rx="1"
          transform="rotate(45 17 17)"
          className="fill-primary"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orbit Dots */}
        <circle cx="17" cy="8.5" r="1.8" className="fill-primary" />
        <circle cx="25.5" cy="17" r="1.8" className="fill-primary" />
        <circle cx="17" cy="25.5" r="1.8" className="fill-primary" />
        <circle cx="8.5" cy="17" r="1.8" className="fill-primary" />
      </motion.svg>

      <span className="font-display text-xl font-semibold tracking-tight text-base-content">
        Prompt<span className="italic font-medium">arium</span>
      </span>
    </a>
  );
};

export default Logo;