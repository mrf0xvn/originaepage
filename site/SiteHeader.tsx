import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { ArrowUpRight, BookOpenText, Menu, X } from "lucide-react";
import shellContract from "./shellContract.json";
import { resolveSectionHref } from "./navigation.ts";
import { SiteWordmark } from "./SiteWordmark.tsx";

interface SiteHeaderProps {
    currentPath: string;
    overlay?: boolean;
    mode?: "default" | "editorial";
}

export const SiteHeader = ({
    currentPath,
    overlay = false,
    mode = "default",
}: SiteHeaderProps): JSX.Element => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isEditorial = mode === "editorial";
    const isInsights = currentPath === "/insights" || currentPath.startsWith("/insights/");
    const isInsightArticle = currentPath.startsWith("/insights/") && currentPath !== "/insights";
    const chromeClass = overlay
        ? "w-full"
        : isEditorial
            ? "sticky top-0 z-30 border-b border-black/5 bg-white/88 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80"
            : "sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90";
    const contentClass = overlay
        ? "flex w-full items-center justify-between"
        : `mx-auto flex w-full items-center justify-between gap-6 px-5 ${isInsightArticle ? "py-3.5" : "py-4"} sm:px-6 ${
            isEditorial ? "lg:px-10" : "lg:px-12"
        } ${isInsightArticle ? "max-w-[1280px]" : "max-w-[1440px]"}`;
    const linkClass = overlay
        ? "font-inter-tight text-sm font-normal text-white/80 transition-colors hover:text-white lg:text-base"
        : isEditorial
            ? "font-inter-tight text-sm font-medium text-[#52525b] transition-colors hover:text-[#111827] lg:text-[0.95rem]"
            : "font-inter-tight text-sm font-medium text-[#3f3f46] transition-colors hover:text-[#0f0f0f] lg:text-base";

    const handleAnchorClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        if (currentPath !== "/" || !href.startsWith("#")) return;

        event.preventDefault();
        document.querySelector(href)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const closeMenu = useCallback(() => setMenuOpen(false), []);

    useEffect(() => {
        if (!menuOpen) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeMenu();
        };
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [menuOpen, closeMenu]);

    return (
        <>
            <header className={chromeClass}>
                <div className={contentClass}>
                    <a href="/" className="inline-flex items-center gap-3" aria-label="Originae home">
                        <SiteWordmark inverted={overlay} />
                        {!overlay && isEditorial ? (
                            <span className="hidden rounded-full border border-[#18181B]/10 bg-[#faf7f5] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71717A] md:inline-flex">
                                {isInsightArticle ? shellContract.editorial.readingEyebrow : shellContract.editorial.eyebrow}
                            </span>
                        ) : null}
                    </a>

                    <nav className="hidden items-center gap-7 md:flex lg:gap-10">
                        {shellContract.primarySectionLinks.map((link) => {
                            const href = resolveSectionHref(currentPath, link.sectionId);
                            return (
                                <a
                                    key={link.sectionId}
                                    href={href}
                                    onClick={(event) => handleAnchorClick(event, href)}
                                    className={linkClass}
                                >
                                    {link.label}
                                </a>
                            );
                        })}
                        <a
                            href={shellContract.insightsLink.href}
                            className={overlay
                                ? linkClass
                                : isInsights
                                    ? "inline-flex items-center gap-2 rounded-full border border-[#F26522]/20 bg-[#FFF5F0] px-3 py-1.5 font-inter-tight text-sm font-semibold text-[#B44A1B]"
                                    : linkClass}
                        >
                            {!overlay && isEditorial ? <BookOpenText className="h-4 w-4" /> : null}
                            {shellContract.insightsLink.label}
                        </a>
                    </nav>

                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger button */}
                        <button
                            type="button"
                            onClick={() => setMenuOpen(true)}
                            className={`inline-flex items-center justify-center rounded-full border p-2.5 transition-colors md:hidden ${
                                overlay
                                    ? "border-white/20 text-white hover:border-white/40"
                                    : "border-[#18181B]/10 text-[#18181B] hover:border-[#18181B]/30 hover:bg-[#f4f4f5]"
                            }`}
                            aria-label="Open menu"
                        >
                            <Menu className="h-4.5 w-4.5" strokeWidth={2} />
                        </button>

                        <a
                            href={shellContract.meetingCta.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={overlay
                                ? "hidden items-center gap-2 font-inter-tight text-sm font-normal text-white/80 underline decoration-white/30 underline-offset-4 transition-all hover:text-white hover:decoration-white sm:inline-flex lg:text-base"
                                : isEditorial
                                    ? "hidden items-center gap-2 font-inter-tight text-sm font-semibold text-[#111827] underline decoration-[#18181B]/20 underline-offset-4 transition-colors hover:text-[#B44A1B] hover:decoration-[#B44A1B]/40 sm:inline-flex"
                                    : "hidden items-center gap-2 rounded-full border border-[#18181B]/10 px-4 py-2 font-inter-tight text-sm font-semibold text-[#18181B] transition-colors hover:border-[#18181B] hover:bg-[#18181B] hover:text-white sm:inline-flex"}
                        >
                            <span>{shellContract.meetingCta.label}</span>
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </header>

            {/* Mobile slide-over menu */}
            {menuOpen ? (
            <div
                className="fixed inset-0 z-50 md:hidden"
                aria-hidden={!menuOpen}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={closeMenu}
                />

                {/* Panel */}
                <div
                    className={`absolute right-0 top-0 flex h-full w-[min(320px,85vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
                        menuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    {/* Panel header */}
                    <div className="flex items-center justify-between border-b border-[#18181B]/8 px-5 py-4">
                        <span className="font-inter-tight text-sm font-semibold uppercase tracking-[0.14em] text-[#71717A]">
                            Menu
                        </span>
                        <button
                            type="button"
                            onClick={closeMenu}
                            className="rounded-full border border-[#18181B]/10 p-2 text-[#18181B] transition-colors hover:bg-[#f4f4f5]"
                            aria-label="Close menu"
                        >
                            <X className="h-4 w-4" strokeWidth={2} />
                        </button>
                    </div>

                    {/* Nav links */}
                    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
                        {shellContract.primarySectionLinks.map((link) => {
                            const href = resolveSectionHref(currentPath, link.sectionId);
                            return (
                                <a
                                    key={link.sectionId}
                                    href={href}
                                    onClick={closeMenu}
                                    className="rounded-2xl px-4 py-3 font-inter-tight text-[0.95rem] font-medium text-[#27272a] transition-colors hover:bg-[#faf7f5]"
                                >
                                    {link.label}
                                </a>
                            );
                        })}
                        <a
                            href={shellContract.insightsLink.href}
                            onClick={closeMenu}
                            className={`rounded-2xl px-4 py-3 font-inter-tight text-[0.95rem] font-medium transition-colors ${
                                isInsights
                                    ? "bg-[#FFF5F0] text-[#B44A1B]"
                                    : "text-[#27272a] hover:bg-[#faf7f5]"
                            }`}
                        >
                            {shellContract.insightsLink.label}
                        </a>

                        <div className="my-3 border-t border-[#18181B]/8" />

                        {shellContract.serviceDetailLinks.map((service) => {
                            const href = resolveSectionHref(currentPath, service.sectionId);
                            return (
                                <a
                                    key={service.sectionId}
                                    href={href}
                                    onClick={closeMenu}
                                    className="rounded-2xl px-4 py-2.5 font-inter-tight text-sm text-[#52525b] transition-colors hover:bg-[#faf7f5] hover:text-[#111827]"
                                >
                                    {service.label}
                                </a>
                            );
                        })}
                    </nav>

                    {/* Panel footer CTA */}
                    <div className="border-t border-[#18181B]/8 px-5 py-5">
                        <a
                            href={shellContract.meetingCta.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMenu}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] px-5 py-3 font-inter-tight text-sm font-semibold text-white transition-colors hover:bg-[#27272a]"
                        >
                            {shellContract.meetingCta.label}
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                        <a
                            href={`mailto:${shellContract.contactItems[1].label}`}
                            className="mt-3 block text-center font-inter-tight text-sm text-[#52525b] transition-colors hover:text-[#111827]"
                        >
                            {shellContract.contactItems[1].label}
                        </a>
                    </div>
                </div>
            </div>
            ) : null}
        </>
    );
};
