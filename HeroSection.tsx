import { ArrowRight } from "./ArrowRight";
import heroVideo from "./image-21.mp4";
import heroPoster from "./image-21-poster.webp";
import vector1 from "./Vector-1.svg";
import vector2 from "./Vector-2.svg";
import vector3 from "./Vector-3.svg";
import vector4 from "./Vector-4.svg";
import vector5 from "./Vector-5.svg";
import vector6 from "./Vector-6.svg";
import vector7 from "./Vector-7.svg";
import vector from "./Vector.svg";
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
    Variants,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
    { label: "Service", href: "#services" },
    { label: "Model", href: "#model" },
    { label: "Team", href: "#team" },
];

const HEADLINE = "Stop brainstorming.\nStart executing.";

const SUBTEXT = `Great initiatives die from a lack of capacity. We bridge the gap between \u201cwe should do this\u201d and \u201cit\u2019s live.\u201d We assemble the specialized team, manage the workflows, and move your business forward. Immediately.`;

const useTypewriter = (
    text: string,
    enabled: boolean,
    speed = 30,
    delay = 800
) => {
    const [displayedCount, setDisplayedCount] = useState(
        enabled ? 0 : text.length
    );
    const [isComplete, setIsComplete] = useState(!enabled);
    const [hasStarted, setHasStarted] = useState(!enabled);

    useEffect(() => {
        if (!enabled) {
            setDisplayedCount(text.length);
            setIsComplete(true);
            setHasStarted(true);
            return;
        }

        setDisplayedCount(0);
        setIsComplete(false);
        setHasStarted(false);

        const delayTimer = window.setTimeout(() => setHasStarted(true), delay);
        return () => window.clearTimeout(delayTimer);
    }, [delay, enabled, text.length]);

    useEffect(() => {
        if (!enabled || !hasStarted) return;
        if (displayedCount >= text.length) {
            setIsComplete(true);
            return;
        }

        const timer = window.setTimeout(() => {
            setDisplayedCount((count) => count + 1);
        }, speed);

        return () => window.clearTimeout(timer);
    }, [displayedCount, enabled, hasStarted, speed, text.length]);

    return {
        displayedText: enabled ? text.slice(0, displayedCount) : text,
        isComplete,
        hasStarted,
    };
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 20,
        },
    },
};

export const HeroSection = (): JSX.Element => {
    const { scrollY } = useScroll();
    const prefersReducedMotion = useReducedMotion();
    const [showHeroVideo, setShowHeroVideo] = useState(false);
    const yBG = useTransform(scrollY, [0, 1000], [0, 200]);
    const scaleBG = useTransform(scrollY, [0, 1000], [1, 1.1]);
    const { displayedText, isComplete, hasStarted } = useTypewriter(
        HEADLINE,
        !prefersReducedMotion,
        55,
        900
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)");
        let activationTimer: number | null = null;

        const syncVideoState = () => {
            const canLoadVideo = mediaQuery.matches && !prefersReducedMotion;
            if (!canLoadVideo) {
                if (activationTimer !== null) {
                    window.clearTimeout(activationTimer);
                }
                setShowHeroVideo(false);
                return;
            }

            activationTimer = window.setTimeout(() => {
                setShowHeroVideo(true);
            }, 250);
        };

        syncVideoState();
        mediaQuery.addEventListener("change", syncVideoState);

        return () => {
            mediaQuery.removeEventListener("change", syncVideoState);
            if (activationTimer !== null) {
                window.clearTimeout(activationTimer);
            }
        };
    }, [prefersReducedMotion]);

    return (
        <section className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-black">
            <img
                className="absolute inset-0 h-full w-full object-cover opacity-50"
                src={heroPoster}
                alt=""
                decoding="async"
                fetchPriority="high"
            />
            {showHeroVideo && (
                <motion.video
                    className="absolute inset-0 h-full w-full object-cover opacity-70"
                    src={heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    style={{ y: yBG, scale: scaleBG }}
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            )}

            <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col px-5 py-[2vh] sm:px-6 sm:py-[2.5vh] lg:px-12 lg:py-[3vh]">
                <motion.header
                    className="flex w-full shrink-0 items-center justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="flex h-[27px] shrink-0 items-center gap-[3px]">
                        <img className="h-[26px] w-auto" alt="O" src={vector7} />
                        <img className="h-[26px] w-auto" alt="R" src={vector6} />
                        <img className="h-[26px] w-auto" alt="I" src={vector5} />
                        <img className="h-[26px] w-auto" alt="G" src={vector4} />
                        <img className="h-[26px] w-auto" alt="I" src={vector3} />
                        <img className="h-[26px] w-auto" alt="N" src={vector2} />
                        <img className="h-[26px] w-auto" alt="A" src={vector1} />
                        <img className="h-[26px] w-auto" alt="E" src={vector} />
                    </div>

                    <nav className="hidden items-center gap-12 md:flex lg:gap-24">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={(event) => {
                                    event.preventDefault();
                                    document
                                        .querySelector(link.href)
                                        ?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="font-['Inter_Tight-Regular',Helvetica] text-sm font-normal text-white/80 transition-colors hover:text-white lg:text-base"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <a
                        href="https://calendly.com/originae"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden font-['Inter_Tight-Regular',Helvetica] text-sm font-normal text-white/80 underline decoration-white/30 underline-offset-4 transition-all hover:text-white hover:decoration-white sm:flex lg:text-base"
                    >
                        Book a meeting &rarr;
                    </a>
                </motion.header>

                <motion.div
                    className="mt-[3vh] flex min-h-0 flex-1 flex-col justify-between sm:mt-[4vh] md:mt-[5vh]"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div
                        className="flex w-full flex-col gap-[2vh] sm:gap-[2.5vh] md:gap-[3vh] xl:max-w-[1200px]"
                        variants={itemVariants}
                    >
                        <div className="relative max-w-[900px]">
                            <h2
                                className="invisible whitespace-pre-line font-inter-tight font-semibold leading-[1.05] tracking-tight text-white"
                                style={{ fontSize: "clamp(28px, min(6vw, 8vh), 72px)" }}
                                aria-hidden="true"
                            >
                                {HEADLINE}
                            </h2>
                            <h2
                                className="absolute inset-0 whitespace-pre-line font-inter-tight font-semibold leading-[1.05] tracking-tight text-white"
                                style={{ fontSize: "clamp(28px, min(6vw, 8vh), 72px)" }}
                            >
                                {hasStarted ? displayedText : ""}
                                {hasStarted && !isComplete && (
                                    <span className="ml-[3px] inline-block h-[0.85em] w-[3px] animate-pulse align-baseline bg-white/90" />
                                )}
                                {isComplete && !prefersReducedMotion && (
                                    <motion.span
                                        className="ml-[3px] inline-block h-[0.85em] w-[3px] align-baseline bg-white/90"
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: 0 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                    />
                                )}
                            </h2>
                        </div>

                        <motion.div
                            className="max-w-[680px] rounded-xl bg-black/15 px-4 py-3 backdrop-blur-[2px] sm:px-6 sm:py-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                        >
                            <p
                                className="font-inter-tight font-normal leading-[1.5] tracking-normal text-white/85 sm:leading-[1.45]"
                                style={{ fontSize: "clamp(13px, min(1.8vw, 2.8vh), 20px)" }}
                            >
                                {SUBTEXT}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={isComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
                        >
                            <a
                                href="https://calendly.com/originae"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary btn-hero group"
                            >
                                <span className="btn-text font-inter-tight text-sm font-semibold md:text-base">
                                    Book a meeting
                                </span>
                                <div className="btn-arrow-circle">
                                    <ArrowRight
                                        className="btn-arrow-icon arrow-pulse-strong h-5 w-5"
                                        color="currentColor"
                                    />
                                </div>
                            </a>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="mt-auto flex w-full shrink-0 flex-col pt-[1.5vh]"
                        variants={itemVariants}
                    >
                        <h1
                            className="w-full text-left font-['Inter_Tight-Medium',Helvetica] font-medium leading-[0.85] tracking-[-0.04em] text-white drop-shadow-2xl"
                            style={{ fontSize: "clamp(28px, min(9vw, 8vh), 135px)" }}
                        >
                            We solve it for you
                        </h1>

                        <div className="mt-[1.5vh] flex w-full items-center justify-between pb-[1vh] sm:mt-[2vh] sm:pb-[1.5vh]">
                            <span className="font-['Inter_Tight-Regular',Helvetica] text-xs text-white/70 sm:text-sm">
                                2026 All Rights Reserved
                            </span>
                            <div className="flex items-center gap-2 text-white/70">
                                <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/35 pt-1.5">
                                    <span className="h-2.5 w-1 rounded-full bg-white/75 animate-pulse" />
                                </div>
                                <ChevronDown
                                    className={`h-4 w-4 text-white/75 ${
                                        prefersReducedMotion ? "" : "animate-bounce"
                                    }`}
                                    strokeWidth={1.75}
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
