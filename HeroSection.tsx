import { ArrowRight } from "./ArrowRight";
import heroVideo from "./image-21.mp4";
import vector1 from "./Vector-1.svg";
import vector2 from "./Vector-2.svg";
import vector3 from "./Vector-3.svg";
import vector4 from "./Vector-4.svg";
import vector5 from "./Vector-5.svg";
import vector6 from "./Vector-6.svg";
import vector7 from "./Vector-7.svg";
import vector from "./Vector.svg";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = ["Service", "Model", "Team"];

const HEADLINE = "Stop brainstorming.\nStart executing.";

const SUBTEXT = `Great initiatives die from a lack of capacity. We bridge the gap between \u201cwe should do this\u201d and \u201cit\u2019s live.\u201d We assemble the specialized team, manage the workflows, and move your business forward. Immediately.`;

const useTypewriter = (text: string, speed = 30, delay = 800) => {
    const [displayedCount, setDisplayedCount] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const delayTimer = setTimeout(() => setHasStarted(true), delay);
        return () => clearTimeout(delayTimer);
    }, [delay]);

    useEffect(() => {
        if (!hasStarted) return;
        if (displayedCount >= text.length) {
            setIsComplete(true);
            return;
        }
        const timer = setTimeout(() => {
            setDisplayedCount((c) => c + 1);
        }, speed);
        return () => clearTimeout(timer);
    }, [hasStarted, displayedCount, text.length, speed]);

    return { displayedText: text.slice(0, displayedCount), isComplete, hasStarted };
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
            damping: 20
        }
    },
};

export const HeroSection = (): JSX.Element => {
    const { scrollY } = useScroll();
    const yBG = useTransform(scrollY, [0, 1000], [0, 200]);
    const scaleBG = useTransform(scrollY, [0, 1000], [1, 1.1]);
    const { displayedText, isComplete, hasStarted } = useTypewriter(HEADLINE, 55, 900);

    return (
        <section className="relative w-full h-[100svh] bg-black flex flex-col overflow-hidden">
            {/* Background Video with Parallax */}
            <motion.video
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                src={heroVideo}
                autoPlay
                loop
                muted
                playsInline
                style={{ y: yBG, scale: scaleBG }}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Content Container — flex-col + justify-between ensures content fills & distributes evenly */}
            <div className="relative z-10 flex flex-col w-full h-full max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-12 py-[2vh] sm:py-[2.5vh] lg:py-[3vh]">

                {/* Header — fixed, compact */}
                <motion.header
                    className="flex items-center justify-between w-full shrink-0"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Logo Vectors */}
                    <div className="flex items-center gap-[3px] h-[27px] shrink-0">
                        <img className="h-[26px] w-auto" alt="O" src={vector7} />
                        <img className="h-[26px] w-auto" alt="R" src={vector6} />
                        <img className="h-[26px] w-auto" alt="I" src={vector5} />
                        <img className="h-[26px] w-auto" alt="G" src={vector4} />
                        <img className="h-[26px] w-auto" alt="I" src={vector3} />
                        <img className="h-[26px] w-auto" alt="N" src={vector2} />
                        <img className="h-[26px] w-auto" alt="A" src={vector1} />
                        <img className="h-[26px] w-auto" alt="E" src={vector} />
                    </div>

                    <nav className="hidden md:flex items-center gap-12 lg:gap-24">
                        {navLinks.map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="font-['Inter_Tight-Regular',Helvetica] font-normal text-white/80 text-sm lg:text-base hover:text-white transition-colors"
                            >
                                {link}
                            </a>
                        ))}
                    </nav>

                    <a
                        href="https://calendly.com/originae"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex font-['Inter_Tight-Regular',Helvetica] font-normal text-white/80 text-sm lg:text-base underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white transition-all"
                    >
                        Book a meeting &rarr;
                    </a>
                </motion.header>

                {/* Main body — flex-1 distributes remaining space */}
                <motion.div
                    className="flex flex-col flex-1 min-h-0 w-full mt-[3vh] sm:mt-[4vh] md:mt-[5vh] justify-between"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {/* Middle Content — headline + subtext + button */}
                    <motion.div className="flex flex-col w-full xl:max-w-[1200px] gap-[2vh] sm:gap-[2.5vh] md:gap-[3vh]" variants={itemVariants}>

                        {/* Headline with typewriter */}
                        <div className="relative max-w-[900px]">
                            {/* Ghost headline */}
                            <h2
                                className="font-inter-tight font-semibold text-white leading-[1.05] tracking-tight invisible whitespace-pre-line"
                                style={{ fontSize: 'clamp(28px, min(6vw, 8vh), 72px)' }}
                                aria-hidden="true"
                            >
                                {HEADLINE}
                            </h2>
                            {/* Typing headline */}
                            <h2
                                className="font-inter-tight font-semibold text-white leading-[1.05] tracking-tight absolute inset-0 whitespace-pre-line"
                                style={{ fontSize: 'clamp(28px, min(6vw, 8vh), 72px)' }}
                            >
                                {hasStarted ? displayedText : ""}
                                {hasStarted && !isComplete && (
                                    <span className="inline-block w-[3px] h-[0.85em] bg-white/90 ml-[3px] align-baseline animate-pulse" />
                                )}
                                {isComplete && (
                                    <motion.span
                                        className="inline-block w-[3px] h-[0.85em] bg-white/90 ml-[3px] align-baseline"
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: 0 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                    />
                                )}
                            </h2>
                        </div>

                        {/* Subtext — fades in after headline */}
                        <motion.div
                            className="max-w-[680px] bg-black/15 backdrop-blur-[2px] rounded-xl px-4 py-3 sm:px-6 sm:py-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                        >
                            <p
                                className="font-inter-tight font-normal text-white/85 leading-[1.5] sm:leading-[1.45] tracking-normal"
                                style={{ fontSize: 'clamp(13px, min(1.8vw, 2.8vh), 20px)' }}
                            >
                                {SUBTEXT}
                            </p>
                        </motion.div>

                        {/* CTA Button — fades in after subtext */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={isComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
                        >
                            <a href="https://calendly.com/originae" target="_blank" rel="noopener noreferrer" className="btn-primary btn-hero group">
                                <span className="btn-text font-inter-tight font-semibold text-sm md:text-base">
                                    Book a meeting
                                </span>
                                <div className="btn-arrow-circle">
                                    <ArrowRight className="btn-arrow-icon w-5 h-5 arrow-pulse-strong" color="currentColor" />
                                </div>
                            </a>
                        </motion.div>

                    </motion.div>

                    {/* Bottom Content — anchored to bottom */}
                    <motion.div className="flex flex-col w-full shrink-0 mt-auto pt-[1.5vh]" variants={itemVariants}>
                        <h1
                            className="font-['Inter_Tight-Medium',Helvetica] font-medium text-white leading-[0.85] tracking-[-0.04em] w-full text-left drop-shadow-2xl"
                            style={{ fontSize: 'clamp(28px, min(9vw, 8vh), 135px)' }}
                        >
                            We solve it for you
                        </h1>

                        <div className="flex items-center justify-between w-full mt-[1.5vh] sm:mt-[2vh] pb-[1vh] sm:pb-[1.5vh]">
                            <span className="font-['Inter_Tight-Regular',Helvetica] text-white/70 text-xs sm:text-sm">
                                2026 All Rights Reserved
                            </span>
                            <div className="flex items-center gap-2 text-white/70">
                                <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/35 pt-1.5">
                                    <span className="h-2.5 w-1 rounded-full bg-white/75 animate-pulse" />
                                </div>
                                <ChevronDown className="h-4 w-4 animate-bounce text-white/75" strokeWidth={1.75} />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
};
