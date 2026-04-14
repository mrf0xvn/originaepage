import { useEffect, useRef, useState } from "react";
import { ChevronDown, List } from "lucide-react";
import type { InsightHeading } from "../content/originaeInsights.ts";

interface ArticleTableOfContentsProps {
    headings: InsightHeading[];
    variant: "sidebar" | "inline";
}

export const ArticleTableOfContents = ({
    headings,
    variant,
}: ArticleTableOfContentsProps): JSX.Element | null => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const headingElements = headings
            .map((h) => document.getElementById(h.id))
            .filter(Boolean) as HTMLElement[];

        if (headingElements.length === 0) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                }
            },
            { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 },
        );

        for (const el of headingElements) {
            observerRef.current.observe(el);
        }

        return () => observerRef.current?.disconnect();
    }, [headings]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveId(id);
        if (variant === "inline") setExpanded(false);
    };

    if (headings.length === 0) return null;

    if (variant === "inline") {
        return (
            <div className="rounded-[24px] border border-[#18181B]/10 bg-[#faf7f5] lg:hidden">
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="flex w-full items-center justify-between px-5 py-4"
                    aria-expanded={expanded}
                >
                    <span className="inline-flex items-center gap-2 font-inter-tight text-sm font-semibold text-[#111827]">
                        <List className="h-4 w-4 text-[#71717A]" />
                        Article map
                    </span>
                    <ChevronDown
                        className={`h-4 w-4 text-[#71717A] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                    />
                </button>
                {expanded ? (
                    <ul className="border-t border-[#18181B]/8 px-5 py-3 space-y-1">
                        {headings.map((heading) => (
                            <li key={heading.id}>
                                <a
                                    href={`#${heading.id}`}
                                    onClick={(e) => handleClick(e, heading.id)}
                                    className={`block rounded-xl px-3 py-2 font-['DM_Sans',Helvetica] text-sm leading-6 transition-colors ${
                                        heading.level === 3 ? "pl-6" : ""
                                    } ${
                                        activeId === heading.id
                                            ? "bg-white text-[#B44A1B] font-semibold shadow-sm"
                                            : "text-[#52525b] hover:bg-white/60 hover:text-[#111827]"
                                    }`}
                                >
                                    {heading.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        );
    }

    // Sidebar variant (desktop)
    return (
        <div className="border-l-2 border-[#18181B]/12 pl-5">
            <p className="editorial-aside-kicker">Article map</p>
            <ul className="mt-4 space-y-1">
                {headings.map((heading) => (
                    <li key={heading.id}>
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => handleClick(e, heading.id)}
                            className={`block rounded-2xl px-3 py-2 font-['DM_Sans',Helvetica] text-sm leading-6 transition-all duration-200 ${
                                heading.level === 3 ? "pl-6" : ""
                            } ${
                                activeId === heading.id
                                    ? "border-l-2 border-[#F26522] bg-[#FFF5F0] text-[#B44A1B] font-semibold -ml-[2px]"
                                    : "text-[#52525b] hover:bg-[#faf7f5] hover:text-[#111827]"
                            }`}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
