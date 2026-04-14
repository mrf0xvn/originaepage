import type React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import shellContract from "./shellContract.json";
import { resolveSectionHref } from "./navigation.ts";

interface SiteFooterProps {
    currentPath: string;
    variant?: "default" | "editorial" | "editorial-lite";
}

export const SiteFooter = ({
    currentPath,
    variant = "default",
}: SiteFooterProps): JSX.Element => {
    const handleAnchorClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        if (currentPath !== "/" || !href.startsWith("#")) return;

        event.preventDefault();
        document.getElementById(href.replace(/^#/, ""))?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    if (variant === "editorial") {
        return (
            <footer className="w-full border-t border-[#18181B]/8 bg-[#111111] text-white">
                <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 py-12 sm:px-6 lg:px-12 lg:py-14">
                    <div className="grid gap-8 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
                        <div className="space-y-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                                {shellContract.editorial.eyebrow}
                            </p>
                            <h2 className="max-w-2xl text-[clamp(2rem,4vw,3.4rem)] leading-[0.96] text-white">
                                {shellContract.editorial.footerPitch}
                            </h2>
                            <p className="max-w-2xl font-['DM_Sans',Helvetica] text-base leading-7 text-white/72">
                                Stay inside the same Originae system: read the archive, return to the landing page, or move directly into a working conversation.
                            </p>
                        </div>

                        <div className="flex flex-col justify-between gap-6">
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={shellContract.insightsLink.href}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#F26522] px-5 py-3 font-inter-tight text-sm font-semibold text-white transition-colors hover:bg-[#d6581f]"
                                >
                                    {shellContract.browseInsightsLabel}
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                                <a
                                    href="/"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 font-inter-tight text-sm font-semibold text-white transition-colors hover:border-white/24 hover:bg-white/[0.05]"
                                >
                                    {shellContract.homeLinkLabel}
                                </a>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                                        Contact
                                    </p>
                                    <a href={shellContract.contactItems[1].href} className="block font-inter-tight text-lg text-white transition-colors hover:text-white/80">
                                        {shellContract.contactItems[1].label}
                                    </a>
                                    <a href={shellContract.meetingCta.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-inter-tight text-sm text-white/70 transition-colors hover:text-white">
                                        {shellContract.meetingCta.label}
                                        <ArrowUpRight className="h-4 w-4" />
                                    </a>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                                        Service paths
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {shellContract.serviceDetailLinks.slice(0, 4).map((service) => {
                                            const href = resolveSectionHref(currentPath, service.sectionId);
                                            return (
                                                <a
                                                    key={service.sectionId}
                                                    href={href}
                                                    onClick={(event) => handleAnchorClick(event, href)}
                                                    className="font-inter-tight text-sm text-white/72 transition-colors hover:text-white"
                                                >
                                                    {service.label}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/48 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                            <span className="font-inter-tight">{shellContract.statusLabel}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
                            {shellContract.footerMeta.map((item, index) => (
                                <span key={item} className="inline-flex items-center gap-2 font-inter-tight">
                                    {index > 0 ? <span aria-hidden="true" className="text-white/30">·</span> : null}
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

    if (variant === "editorial-lite") {
        return (
            <footer className="w-full border-t border-[#18181B]/8 bg-[#faf7f5] text-[#111827]">
                <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-5 py-10 sm:px-6 lg:px-10 lg:py-12">
                    <div className="grid gap-6 rounded-[32px] border border-[#18181B]/10 bg-white p-6 shadow-[0_28px_90px_-60px_rgba(15,15,15,0.25)] lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
                        <div className="space-y-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71717A]">
                                {shellContract.editorial.readingEyebrow}
                            </p>
                            <h2 className="max-w-2xl text-[clamp(1.9rem,3.8vw,3rem)] leading-[0.98] text-[#111827]">
                                {shellContract.editorial.articleFooterPitch}
                            </h2>
                            <p className="max-w-2xl font-['DM_Sans',Helvetica] text-base leading-7 text-[#52525b]">
                                Stay in a calmer editorial mode: move to the next insight, return to the main site,
                                or open a direct conversation when you want help turning signal into execution.
                            </p>
                        </div>

                        <div className="flex flex-col justify-between gap-6">
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={shellContract.insightsLink.href}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-3 font-inter-tight text-sm font-semibold text-white transition-colors hover:bg-[#27272a]"
                                >
                                    {shellContract.browseInsightsLabel}
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                                <a
                                    href={shellContract.meetingCta.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-[#18181B]/10 px-5 py-3 font-inter-tight text-sm font-semibold text-[#111827] transition-colors hover:border-[#18181B]/20 hover:bg-[#faf7f5]"
                                >
                                    {shellContract.meetingCta.label}
                                    <ArrowUpRight className="h-4 w-4" />
                                </a>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71717A]">
                                        Contact
                                    </p>
                                    <a
                                        href={shellContract.contactItems[1].href}
                                        className="block font-inter-tight text-lg text-[#111827] transition-colors hover:text-[#B44A1B]"
                                    >
                                        {shellContract.contactItems[1].label}
                                    </a>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71717A]">
                                        Return paths
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <a
                                            href="/"
                                            className="font-inter-tight text-sm text-[#52525b] transition-colors hover:text-[#111827]"
                                        >
                                            {shellContract.homeLinkLabel}
                                        </a>
                                        {shellContract.serviceDetailLinks.slice(0, 3).map((service) => {
                                            const href = resolveSectionHref(currentPath, service.sectionId);
                                            return (
                                                <a
                                                    key={service.sectionId}
                                                    href={href}
                                                    onClick={(event) => handleAnchorClick(event, href)}
                                                    className="font-inter-tight text-sm text-[#52525b] transition-colors hover:text-[#111827]"
                                                >
                                                    {service.label}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-[#18181B]/8 pt-5 text-sm text-[#71717A] sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                            <span className="font-inter-tight">{shellContract.statusLabel}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
                            {shellContract.footerMeta.map((item, index) => (
                                <span key={item} className="inline-flex items-center gap-2 font-inter-tight">
                                    {index > 0 ? <span aria-hidden="true" className="text-[#A1A1AA]/50">·</span> : null}
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <footer className="w-full border-t border-white/10 bg-[#151515] text-white">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-14 lg:px-20 lg:py-20">
                <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1fr_1fr_1.2fr] lg:gap-16 lg:pb-16">
                    <div className="flex flex-col gap-6">
                        <p className="font-inter-tight text-xs font-semibold uppercase tracking-[0.14em] text-[#71717A]">
                            Services
                        </p>
                        <div className="flex flex-col gap-3">
                            {shellContract.serviceDetailLinks.map((service) => {
                                const href = resolveSectionHref(currentPath, service.sectionId);
                                return (
                                    <a
                                        key={service.sectionId}
                                        href={href}
                                        onClick={(event) => handleAnchorClick(event, href)}
                                        className="w-fit font-inter-tight text-base text-[#F5F5F5] transition-all duration-300 hover:translate-x-1 hover:text-white"
                                    >
                                        {service.label}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p className="font-inter-tight text-xs font-semibold uppercase tracking-[0.14em] text-[#71717A]">
                            Editorial
                        </p>
                        <a
                            href={shellContract.editorial.href}
                            className="inline-flex items-center gap-3 font-inter-tight text-base text-[#F5F5F5] transition-colors hover:text-white"
                        >
                            {shellContract.editorial.label}
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                        <p className="max-w-sm font-['DM_Sans',Helvetica] text-sm leading-6 text-[#A1A1AA]">
                            {shellContract.editorial.description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p className="font-inter-tight text-xs font-semibold uppercase tracking-[0.14em] text-[#71717A]">
                            Let's get in touch
                        </p>

                        <a
                            href={shellContract.contactItems[0].href}
                            className="group flex items-center gap-4 border-b border-[#9d9d9e]/30 py-4"
                        >
                            <span className="font-inter-tight text-[clamp(20px,2.8vw,34px)] leading-[1.1] tracking-tight text-[#F5F5F5] transition-colors group-hover:text-white">
                                {shellContract.contactItems[0].label}
                            </span>
                        </a>

                        <a
                            href={shellContract.contactItems[1].href}
                            className="group flex items-center gap-4 py-4"
                        >
                            <span className="font-inter-tight text-[clamp(20px,2.8vw,34px)] leading-[1.1] tracking-tight text-[#F5F5F5] transition-colors group-hover:text-white">
                                {shellContract.contactItems[1].label}
                            </span>
                        </a>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-10 lg:gap-12">
                    <p className="bg-gradient-to-br from-white via-white/80 to-white/30 bg-clip-text text-center font-['Inter_Tight',Helvetica] text-[clamp(38px,7vw,88px)] font-medium leading-[0.95] tracking-tighter text-transparent">
                        We solve it
                        <br className="lg:hidden" /> for you
                    </p>

                    <div className="flex w-full flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                            <span className="font-inter-tight text-sm text-[#A1A1AA]">
                                {shellContract.statusLabel}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-3 sm:justify-end">
                            {shellContract.footerMeta.map((item, index) => (
                                <span
                                    key={item}
                                    className={`inline-flex items-center gap-2 font-inter-tight text-sm text-[#A1A1AA] ${
                                        index === shellContract.footerMeta.length - 1
                                            ? "underline decoration-white/30 underline-offset-4"
                                            : ""
                                    }`}
                                >
                                    {index > 0 ? <span aria-hidden="true" className="text-white/20">·</span> : null}
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
