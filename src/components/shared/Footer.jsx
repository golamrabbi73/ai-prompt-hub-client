// src/components/shared/Footer.jsx
import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="border-t border-base-300 bg-base-200">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                {/* Brand */}
                <div className="md:col-span-2">
                    <Logo />
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-base-content/60">
                        Promptarium is a community-driven marketplace for discovering,
                        sharing, and saving high-quality AI prompts for ChatGPT, Gemini,
                        Claude, Midjourney, and more.
                    </p>
                    <div
                        className="mt-5 flex items-center gap-4"
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-base-content/40 hover:text-base-content"
                    >
                        <FiGithub size={18} />
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-base-content/40 hover:text-base-content"
                        >
                            <FiTwitter size={18} />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-base-content/40 hover:text-base-content"
                        >
                            <FiLinkedin size={18} />
                        </a>
                    </div>
                </div>

                {/* Explore */}
                <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-base-content/50">
                        Explore
                    </h3>
                    <ul className="mt-4 space-y-3">
                        {[
                            { label: "All Prompts", to: "/all-prompts" },
                            { label: "Login", to: "/login" },
                            { label: "Register", to: "/register" },
                                ].map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className="text-sm text-base-content/60 hover:text-base-content"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* AI Tools */}
                <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-base-content/50">
                        AI Tools
                    </h3>
                    <ul className="mt-4 space-y-3">
                        {[
                            "ChatGPT",
                            "Gemini",
                            "Claude",
                            "Midjourney",
                            "Stable Diffusion",
                            ].map((tool) => (
                            <li key={tool}>
                                <Link
                                    to={`/all-prompts?aiTool=${tool}`}
                                    className="text-sm text-base-content/60 hover:text-base-content"
                                >
                                    {tool}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-base-300 pt-6 md:flex-row">
                <p className="text-xs text-base-content/40">
                    © {new Date().getFullYear()} Promptarium. All rights reserved.
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-base-content/30">
                    Built for AI prompt enthusiasts
                </p>
            </div>
        </div>
    </footer>
  );
};

export default Footer;