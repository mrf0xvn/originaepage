import { useState } from "react";
import { ORIGINAE_TOPICS, originaeInsights } from "../content/originaeInsights.ts";
import { InsightCard } from "./InsightCard.tsx";
import { useSeo } from "./useSeo.ts";

export const InsightsIndexPage = (): JSX.Element => {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    useSeo({
        title: "Originae Insights — Execution notes & working signal",
        description: "Curated observations for founders and operators across systems, GTM, delivery, and strategic execution work.",
        canonicalUrl: "https://originae.org/insights",
        ogImage: "https://originae.org/og-cover.jpg",
    });

    const leadArticle = originaeInsights[0];
    const supportStart = leadArticle ? 1 : 0;
    const supportInsights = originaeInsights.slice(supportStart, supportStart + 2);
    const allArchiveInsights = originaeInsights.slice(supportStart + supportInsights.length);

    const filteredArchiveInsights = activeFilter
        ? allArchiveInsights.filter((a) => a.topic === activeFilter)
        : allArchiveInsights;

    return (
        <div className="bg-white">
            <section
                id="top"
                className="border-b border-[#18181B]/8 bg-[linear-gradient(180deg,#faf7f5_0%,#ffffff_78%)]"
            >
                <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-12">
                        <div className="max-w-[760px] space-y-5">
                            <p className="editorial-kicker">Originae insights</p>
                            <h1 className="max-w-[14ch] text-[clamp(3.35rem,6.3vw,5.9rem)] leading-[0.9] tracking-[-0.05em] text-[#111827]">
                                Execution notes & working signal.
                            </h1>
                            <p className="max-w-[680px] font-['DM_Sans',Helvetica] text-[1rem] leading-7 text-[#52525b] sm:text-[1.04rem] sm:leading-8">
                                Curated observations for founders and operators across systems,
                                GTM, delivery, and strategic execution work.
                            </p>
                        </div>

                        <div className="rounded-[28px] border border-[#18181B]/10 bg-white/90 p-5 shadow-[0_24px_70px_-64px_rgba(15,15,15,0.32)] sm:p-6">
                            <p className="font-inter-tight text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71717A]">
                                Editorial themes
                            </p>
                            <p className="mt-3 font-['DM_Sans',Helvetica] text-sm leading-6 text-[#63636B]">
                                Five recurring tracks across how Originae reads systems, GTM,
                                delivery, and market movement.
                            </p>
                            <div
                                className="mt-4 flex flex-wrap gap-2.5"
                                aria-label="Filter by editorial theme"
                            >
                                {ORIGINAE_TOPICS.map((topic) => (
                                    <button
                                        key={topic.slug}
                                        type="button"
                                        onClick={() =>
                                            setActiveFilter(activeFilter === topic.slug ? null : topic.slug)
                                        }
                                        className={`rounded-full border px-3.5 py-2 font-inter-tight text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 ${
                                            activeFilter === topic.slug
                                                ? "border-[#F26522]/30 bg-[#FFF5F0] text-[#B44A1B]"
                                                : "border-[#18181B]/10 bg-[#faf7f5] text-[#71717A] hover:border-[#18181B]/20 hover:text-[#52525b]"
                                        }`}
                                        aria-pressed={activeFilter === topic.slug}
                                    >
                                        {topic.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto flex w-full max-w-[1120px] flex-col px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="flex flex-col gap-4 border-b border-[#18181B]/8 pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <p className="editorial-kicker">Latest dispatch</p>
                        <h2 className="editorial-section-title max-w-2xl">
                            One lead dispatch, followed by a calmer supporting stack.
                        </h2>
                    </div>
                    <p className="max-w-[420px] font-['DM_Sans',Helvetica] text-[0.96rem] leading-7 text-[#63636B]">
                        The lead story carries the first impression. Everything beside it should
                        step down and guide scanning instead of repeating the same visual weight.
                    </p>
                </div>

                <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(280px,0.88fr)] lg:items-start lg:gap-5">
                    {leadArticle ? <InsightCard article={leadArticle} variant="feature" /> : null}

                    <div className="grid gap-3">
                        {supportInsights.map((article) => (
                            <InsightCard key={article.slug} article={article} variant="support" />
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-t border-[#18181B]/8 bg-[#f7f1ed]">
                <div className="mx-auto flex w-full max-w-[1120px] flex-col px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-2">
                            <p className="editorial-kicker text-[#71717A]">Archive</p>
                            <h2 className="editorial-section-title max-w-2xl">
                                A quieter browse mode for the rest of the thread.
                            </h2>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="max-w-[420px] font-['DM_Sans',Helvetica] text-[0.96rem] leading-7 text-[#63636B]">
                                {activeFilter
                                    ? `Showing ${filteredArchiveInsights.length} article${filteredArchiveInsights.length !== 1 ? "s" : ""} in this thread.`
                                    : "The archive should feel like a reset: faster to scan, lighter in density, and clearly distinct from the opening dispatch."}
                            </p>
                            {activeFilter ? (
                                <button
                                    type="button"
                                    onClick={() => setActiveFilter(null)}
                                    className="w-fit font-inter-tight text-sm font-semibold text-[#B44A1B] transition-colors hover:text-[#F26522]"
                                >
                                    ← Show all articles
                                </button>
                            ) : null}
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {filteredArchiveInsights.map((article) => (
                            <InsightCard key={article.slug} article={article} variant="archive" />
                        ))}
                        {filteredArchiveInsights.length === 0 ? (
                            <p className="col-span-full py-10 text-center font-['DM_Sans',Helvetica] text-sm text-[#71717A]">
                                No articles match this filter yet.
                            </p>
                        ) : null}
                    </div>
                </div>
            </section>
        </div>
    );
};
