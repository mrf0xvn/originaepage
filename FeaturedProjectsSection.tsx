import {
    AnimatePresence,
    motion,
    useAnimationFrame,
    useMotionValue,
    useReducedMotion,
} from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import drumeeLogo from "./Logo/Drumee.png";
import eldoraLogo from "./Logo/Eldora.png";
import fensoryLogo from "./Logo/fensory.png";

const FEATURED_PROJECTS = [
    {
        name: "Drumee",
        descriptor: "Cloud Infrastructure \u00b7 SaaS",
        href: "https://drumee.org/",
        image: drumeeLogo,
        logoClassName: "h-10 w-auto sm:h-12",
        cardClassName:
            "bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(246,239,255,0.88))]",
    },
    {
        name: "Eldora",
        descriptor: "Web3 \u00b7 Real World Assets \u00b7 Blockchain",
        href: "https://eldora.do/",
        image: eldoraLogo,
        logoClassName: "h-16 w-auto sm:h-[4.5rem]",
        cardClassName:
            "bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(238,242,249,0.9))]",
    },
    {
        name: "Fensory",
        descriptor: "Crypto Wealth Allocation Platform",
        href: "https://www.fensory.com/",
        image: fensoryLogo,
        logoClassName: "h-8 w-auto sm:h-9",
        cardClassName:
            "bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,243,239,0.9))]",
    },
];

const TRACK_REPEAT_COUNT = 4;
const AUTO_SCROLL_SPEED = 42;

type TrackProject = (typeof FEATURED_PROJECTS)[number] & {
    key: string;
};

export const FeaturedProjectsSection = (): JSX.Element => {
    const prefersReducedMotion = useReducedMotion();
    const repeatedProjects = useMemo<TrackProject[]>(
        () =>
            Array.from({ length: TRACK_REPEAT_COUNT }, (_, cycle) =>
                FEATURED_PROJECTS.map((project) => ({
                    ...project,
                    key: `${project.name}-${cycle}`,
                }))
            ).flat(),
        []
    );

    const rowRef = useRef<HTMLDivElement | null>(null);
    const loopWidthRef = useRef(0);
    const hasInitialisedRef = useRef(false);
    const x = useMotionValue(0);
    const [spotlightProjectName, setSpotlightProjectName] = useState<string | null>(null);

    const spotlightProject =
        FEATURED_PROJECTS.find((project) => project.name === spotlightProjectName) ?? null;

    useLayoutEffect(() => {
        if (prefersReducedMotion) return;

        const measureTrack = () => {
            const row = rowRef.current;
            if (!row) return;

            const loopWidth = row.scrollWidth / TRACK_REPEAT_COUNT;
            loopWidthRef.current = loopWidth;

            if (!hasInitialisedRef.current && loopWidth > 0) {
                x.set(-loopWidth);
                hasInitialisedRef.current = true;
            }
        };

        measureTrack();

        const resizeObserver = new ResizeObserver(() => {
            measureTrack();
        });

        if (rowRef.current) resizeObserver.observe(rowRef.current);

        return () => resizeObserver.disconnect();
    }, [prefersReducedMotion, repeatedProjects, x]);

    useAnimationFrame((_, delta) => {
        if (prefersReducedMotion) return;
        if (!loopWidthRef.current) return;
        if (spotlightProjectName) return;

        let nextX = x.get() - (AUTO_SCROLL_SPEED * delta) / 1000;

        while (nextX <= -2 * loopWidthRef.current) nextX += loopWidthRef.current;
        while (nextX > -loopWidthRef.current) nextX -= loopWidthRef.current;

        x.set(nextX);
    });

    return (
        <section className="relative flex w-full flex-col items-center overflow-hidden bg-[#f7f5f1] py-16 lg:py-20">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9c1b7] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c9c1b7] to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,101,34,0.10),transparent_42%)]" />

            <div className="relative z-10 flex w-full max-w-7xl flex-col gap-10 px-6 lg:gap-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="flex flex-col gap-5"
                >
                    <p className="font-['Inter_Tight-SemiBold',Helvetica] text-base font-semibold uppercase tracking-[0.18em] text-[#6b665f] lg:text-lg">
                        SELECTED WORK
                    </p>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <h2 className="max-w-2xl font-['Inter_Tight-Regular',Helvetica] text-4xl font-normal leading-tight text-[#171410] lg:text-6xl">
                            Brands and products we have helped move from concept to shipped work.
                        </h2>
                        <p className="max-w-xl font-inter-tight text-base leading-relaxed text-[#5f584f] lg:text-lg">
                            Hover a brand to lock focus, inspect the spotlight card at center, then click through to the live website.
                        </p>
                    </div>
                </motion.div>

                {prefersReducedMotion ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {FEATURED_PROJECTS.map((project) => (
                            <a
                                key={project.name}
                                href={project.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${project.name} website`}
                                className={`group rounded-[28px] border border-[#d8d3cc] px-5 py-6 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 ${project.cardClassName}`}
                            >
                                <div className="flex min-h-[92px] items-center justify-center rounded-[22px] bg-white/78 px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        loading="lazy"
                                        decoding="async"
                                        className={`${project.logoClassName} object-contain transition-transform duration-300 group-hover:scale-[1.03]`}
                                    />
                                </div>
                                <p className="mt-4 text-center font-inter-tight text-[13px] leading-[1.35] text-[#6b665f]">
                                    {project.descriptor}
                                </p>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div
                        onMouseLeave={() => setSpotlightProjectName(null)}
                        className="project-spotlight-mask relative isolate h-[272px] overflow-hidden rounded-[32px] border border-[#d8d3cc] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(243,238,231,0.92))] shadow-[0_26px_70px_-38px_rgba(0,0,0,0.45)]"
                    >
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-[#f7f5f1] via-[#f7f5f1]/88 to-transparent sm:w-28" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-[#f7f5f1] via-[#f7f5f1]/88 to-transparent sm:w-28" />
                        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f26522]/12 blur-3xl sm:h-60 sm:w-60" />

                        <motion.div
                            ref={rowRef}
                            style={{ x }}
                            className={`absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-6 pl-6 pr-6 transition-opacity duration-300 sm:gap-8 sm:pl-8 sm:pr-8 ${
                                spotlightProject ? "pointer-events-none opacity-[0.08]" : "opacity-100"
                            }`}
                        >
                            {repeatedProjects.map((project) => (
                                <button
                                    key={project.key}
                                    type="button"
                                    onMouseEnter={() => setSpotlightProjectName(project.name)}
                                    className="group relative block cursor-pointer border-none bg-transparent p-0"
                                >
                                    <div
                                        className={`w-[252px] rounded-[30px] border border-[rgba(23,20,16,0.08)] px-5 py-5 shadow-[0_22px_54px_-34px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-all duration-300 ${project.cardClassName}`}
                                        style={{
                                            transform: "scale(0.84) translateY(8px)",
                                            filter: "blur(0.6px)",
                                        }}
                                    >
                                        <div className="flex min-h-[102px] items-center justify-center rounded-[24px] bg-white/84 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                                            <img
                                                src={project.image}
                                                alt={project.name}
                                                loading="lazy"
                                                decoding="async"
                                                className={`${project.logoClassName} object-contain`}
                                            />
                                        </div>
                                        <div className="mt-4 min-h-[44px] px-2">
                                            <p className="text-center font-inter-tight text-[13px] font-medium leading-[1.35] text-[#5f584f]">
                                                {project.descriptor}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </motion.div>

                        <AnimatePresence>
                            {spotlightProject && (
                                <div className="absolute inset-0 z-30 flex items-center justify-center px-4 sm:px-0">
                                    <motion.a
                                        key={spotlightProject.name}
                                        href={spotlightProject.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${spotlightProject.name} website`}
                                        initial={{ opacity: 0, y: 18, scale: 0.92 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 12, scale: 0.96 }}
                                        transition={{ duration: 0.28, ease: "easeOut" }}
                                        className="group block w-[276px] rounded-[32px] border border-[#c9c1b7] px-5 py-5 shadow-[0_34px_90px_-34px_rgba(0,0,0,0.58)] backdrop-blur-sm sm:w-[304px]"
                                        style={{ pointerEvents: "auto" }}
                                    >
                                        <div
                                            className={`rounded-[30px] p-5 ${spotlightProject.cardClassName}`}
                                        >
                                            <div className="flex min-h-[116px] items-center justify-center rounded-[24px] bg-white/90 px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
                                                <img
                                                    src={spotlightProject.image}
                                                    alt={spotlightProject.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className={`${spotlightProject.logoClassName} object-contain transition-transform duration-300 group-hover:scale-[1.03]`}
                                                />
                                            </div>
                                            <div className="mt-5 min-h-[52px] px-2">
                                                <p className="text-center font-inter-tight text-[14px] font-medium leading-[1.4] text-[#4e483f]">
                                                    {spotlightProject.descriptor}
                                                </p>
                                            </div>
                                            <div className="mt-5 flex justify-center">
                                                <span className="rounded-full border border-[#171410]/10 bg-white/78 px-4 py-2 font-inter-tight text-[11px] uppercase tracking-[0.16em] text-[#171410]">
                                                    Visit website &rarr;
                                                </span>
                                            </div>
                                        </div>
                                    </motion.a>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </section>
    );
};
