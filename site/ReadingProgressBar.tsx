import { useEffect, useState } from "react";

export const ReadingProgressBar = (): JSX.Element | null => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const articleBody = document.querySelector(".insight-prose");
        if (!articleBody) return;

        const update = () => {
            const rect = articleBody.getBoundingClientRect();
            const articleTop = rect.top + window.scrollY;
            const articleHeight = rect.height;
            const scrolled = window.scrollY - articleTop;
            const pct = Math.min(100, Math.max(0, (scrolled / (articleHeight - window.innerHeight * 0.4)) * 100));
            setProgress(pct);
        };

        window.addEventListener("scroll", update, { passive: true });
        update();
        return () => window.removeEventListener("scroll", update);
    }, []);

    if (progress <= 0) return null;

    return (
        <div className="fixed left-0 top-[49px] z-40 h-[3px] w-full bg-transparent sm:top-[53px]">
            <div
                className="h-full rounded-r-full bg-gradient-to-r from-[#F26522] to-[#B44A1B] transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Reading progress"
            />
        </div>
    );
};
