import { ArrowUpRight, CalendarDays, ChevronRight, Clock3 } from "lucide-react";
import shellContract from "../site/shellContract.json";
import { ReadingProgressBar } from "../site/ReadingProgressBar.tsx";
import { ShareBar } from "./ShareBar.tsx";
import { ArticleTableOfContents } from "./ArticleTableOfContents.tsx";
import {
    OriginaeInsightArticle,
    getRelatedInsights,
} from "../content/originaeInsights.ts";
import { InsightCard } from "./InsightCard.tsx";
import { useSeo } from "./useSeo.ts";

interface InsightArticlePageProps {
    article: OriginaeInsightArticle;
}

const IMAGE_FALLBACK = "/og-cover.jpg";

export const InsightArticlePage = ({
    article,
}: InsightArticlePageProps): JSX.Element => {
    const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    const relatedInsights = getRelatedInsights(article, 3);
    const articleUrl = `https://originae.org/insights/${article.slug}`;

    // Dynamic SEO: title, meta, canonical, JSON-LD
    useSeo({
        title: article.seoTitle || `${article.title} | Originae Insights`,
        description: article.seoDescription || article.excerpt,
        canonicalUrl: articleUrl,
        ogImage: article.coverImage || `https://originae.org${IMAGE_FALLBACK}`,
        ogType: "article",
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.seoDescription || article.excerpt,
            "image": article.coverImage || `https://originae.org${IMAGE_FALLBACK}`,
            "datePublished": article.publishedAt,
            "dateModified": article.publishedAt,
            "wordCount": article.bodyHtml?.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length || 0,
            "author": {
                "@type": "Organization",
                "name": "Originae",
                "@id": "https://originae.org/#organization",
            },
            "publisher": {
                "@id": "https://originae.org/#organization",
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": articleUrl,
            },
            "keywords": article.tags?.join(", ") || "",
        },
    });

    return (
        <article className="bg-white">
            <ReadingProgressBar />

            {/* Hero / Header */}
            <section className="border-b border-[#18181B]/8 bg-[linear-gradient(180deg,#faf7f5_0%,#ffffff_82%)]">
                <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-6 px-5 py-12 sm:px-6 lg:px-8 lg:py-14">

                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb">
                        <ol className="flex flex-wrap items-center gap-1.5 font-inter-tight text-sm text-[#71717A]">
                            <li>
                                <a href="/" className="transition-colors hover:text-[#111827]">Originae</a>
                            </li>
                            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                            <li>
                                <a href="/insights" className="transition-colors hover:text-[#111827]">Insights</a>
                            </li>
                            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                            <li className="truncate max-w-[280px] text-[#111827] font-medium" aria-current="page">
                                {article.title}
                            </li>
                        </ol>
                    </nav>

                    <div className="max-w-[820px] space-y-5">
                        {/* Topic badge */}
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                            <span
                                className="rounded-full px-3 py-1 text-white"
                                style={{ backgroundColor: article.topicAccent }}
                            >
                                {article.topicName}
                            </span>
                            <span>{article.serviceName}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-[clamp(2.4rem,4.8vw,4.2rem)] leading-[0.96] tracking-[-0.04em] text-[#111827]">
                            {article.title}
                        </h1>

                        {/* Full excerpt */}
                        <p className="max-w-[760px] font-['DM_Sans',Helvetica] text-[1rem] leading-8 text-[#52525b]">
                            {article.excerpt}
                        </p>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#71717A]">
                            <span className="inline-flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                                <time dateTime={article.publishedAt}>{publishedDate}</time>
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <Clock3 className="h-4 w-4" aria-hidden="true" />
                                {article.readTime} min read
                            </span>
                            <span className="inline-flex items-center gap-1.5 font-medium text-[#111827]">
                                Originae Editorial
                            </span>
                            <a
                                href={article.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 font-semibold text-[#111827] transition-colors hover:text-[#B44A1B]"
                                aria-label={`Source: ${article.sourceName}`}
                            >
                                Source: {article.sourceName}
                                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                            </a>
                        </div>

                        {/* Share bar */}
                        <ShareBar url={articleUrl} title={article.title} />
                    </div>
                </div>
            </section>

            {/* Article body + sidebar grid */}
            <section className="mx-auto grid w-full max-w-[1080px] gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_270px] lg:px-8 lg:py-14 xl:gap-12">
                <div className="space-y-8">
                    {/* Mobile: Key Takeaways above body */}
                    {article.keyTakeaways.length > 0 ? (
                        <div className="editorial-aside-panel bg-[#F26522] text-white lg:hidden">
                            <p className="editorial-aside-kicker text-white/72">Key takeaways</p>
                            <ul className="mt-4 space-y-3 font-['DM_Sans',Helvetica] text-sm leading-6 text-white/90">
                                {article.keyTakeaways.map((takeaway) => (
                                    <li
                                        key={takeaway}
                                        className="border-t border-white/18 pt-3 first:border-t-0 first:pt-0"
                                    >
                                        {takeaway}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {/* Mobile: Inline collapsible TOC */}
                    <ArticleTableOfContents headings={article.headings} variant="inline" />

                    {/* Cover image */}
                    <div className="overflow-hidden rounded-[28px] border border-[#18181B]/10 bg-[#f4f4f5] shadow-[0_20px_60px_-44px_rgba(15,15,15,0.22)]">
                        <div className="aspect-[16/9] max-h-[480px] w-full">
                            <img
                                src={article.coverImage}
                                alt={article.title}
                                className="h-full w-full object-cover"
                                loading="eager"
                                onError={(e) => { e.currentTarget.src = IMAGE_FALLBACK; }}
                            />
                        </div>
                    </div>

                    {/* Article prose */}
                    <div
                        className="insight-prose max-w-[720px]"
                        dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
                    />

                    {/* Next Move CTA */}
                    <section className="rounded-[28px] border border-[#18181B]/10 bg-[#faf7f5] p-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div className="space-y-3">
                                <p className="editorial-kicker text-[#71717A]">Next move</p>
                                <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] leading-[0.98] text-[#111827]">
                                    Continue the operator thread — or move from reading to execution.
                                </h2>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <a href="/insights" className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-3 font-inter-tight text-sm font-semibold text-white transition-colors hover:bg-[#27272a]">
                                    {shellContract.browseInsightsLabel}
                                    <ArrowUpRight className="h-4 w-4" />
                                </a>
                                <a href="/#services" className="inline-flex items-center gap-2 rounded-full border border-[#18181B]/10 px-5 py-3 font-inter-tight text-sm font-semibold text-[#111827] transition-colors hover:border-[#18181B]/18 hover:bg-white">
                                    Explore services
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Related articles */}
                    {relatedInsights.length > 0 ? (
                        <section className="space-y-5 border-t border-[#18181B]/8 pt-10">
                            <div className="space-y-2">
                                <p className="editorial-kicker text-[#71717A]">Continue reading</p>
                                <h2 className="editorial-section-title max-w-2xl">
                                    More Originae insights from the same operating thread.
                                </h2>
                            </div>
                            <div className="grid gap-4 xl:grid-cols-3">
                                {relatedInsights.map((relatedArticle) => (
                                    <InsightCard key={relatedArticle.slug} article={relatedArticle} variant="related" />
                                ))}
                            </div>
                        </section>
                    ) : null}
                </div>

                {/* Desktop sidebar */}
                <aside className="hidden flex-col gap-5 lg:sticky lg:top-24 lg:flex lg:self-start">
                    <ArticleTableOfContents headings={article.headings} variant="sidebar" />

                    {article.keyTakeaways.length > 0 ? (
                        <div className="editorial-aside-panel bg-[#F26522] text-white">
                            <p className="editorial-aside-kicker text-white/72">Key takeaways</p>
                            <ul className="mt-4 space-y-3 font-['DM_Sans',Helvetica] text-sm leading-6 text-white/90">
                                {article.keyTakeaways.map((takeaway) => (
                                    <li
                                        key={takeaway}
                                        className="border-t border-white/18 pt-3 first:border-t-0 first:pt-0"
                                    >
                                        {takeaway}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </aside>
            </section>
        </article>
    );
};