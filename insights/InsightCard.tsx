import { ArrowRight, Clock3 } from "lucide-react";
import { OriginaeInsightArticle } from "../content/originaeInsights.ts";

const IMAGE_FALLBACK = "/og-cover.jpg";
const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = IMAGE_FALLBACK;
};

type InsightCardVariant = "feature" | "support" | "archive" | "related";

interface InsightCardProps {
    article: OriginaeInsightArticle;
    variant?: InsightCardVariant;
}

export const InsightCard = ({
    article,
    variant = "support",
}: InsightCardProps): JSX.Element => {
    const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const isFeature = variant === "feature";
    const isSupport = variant === "support";
    const isArchive = variant === "archive";
    const isRelated = variant === "related";
    const compactLabelClass = isSupport || isArchive ? "text-[10px]" : "text-[11px]";

    const renderLabelRow = (compact = false) => (
        <div
            className={`flex flex-wrap items-center gap-2 font-semibold uppercase tracking-[0.15em] text-[#71717A] ${
                compact ? compactLabelClass : "text-[11px]"
            }`}
        >
            <span
                className={`rounded-full text-white ${compact ? "px-2.5 py-1" : "px-3 py-1"}`}
                style={{ backgroundColor: article.topicAccent }}
            >
                {article.topicName}
            </span>
            <span>{article.serviceName}</span>
        </div>
    );

    const renderMetaRow = (compact = false) => (
        <div
            className={`flex flex-wrap items-center gap-2.5 text-[#71717A] ${
                compact ? "text-[12px]" : "text-sm"
            }`}
        >
            <span>{formattedDate}</span>
            <span className="inline-flex items-center gap-1.5">
                <Clock3 className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
                {article.readTime} min read
            </span>
        </div>
    );

    if (isFeature) {
        return (
            <a
                href={`/insights/${article.slug}`}
                className="group overflow-hidden rounded-[30px] border border-[#18181B]/10 bg-white text-[#111827] shadow-[0_26px_80px_-68px_rgba(15,15,15,0.38)] transition-all duration-300 hover:border-[#18181B]/18 hover:shadow-[0_34px_90px_-70px_rgba(15,15,15,0.4)]"
            >
                <div className="grid gap-0 xl:grid-cols-[minmax(0,1.02fr)_360px]">
                    <div className="flex flex-col gap-6 p-6 sm:p-7 xl:p-8">
                        <div className="space-y-4">
                            {renderLabelRow()}
                            <div className="space-y-3">
                                <p className="font-inter-tight text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71717A]">
                                    Lead dispatch
                                </p>
                                <h3 className="text-[clamp(2rem,3vw,2.85rem)] leading-[0.96] tracking-[-0.035em] text-[#111827]">
                                    {article.title}
                                </h3>
                                <p className="max-w-[56ch] font-['DM_Sans',Helvetica] text-[1rem] leading-7 text-[#52525b]">
                                    {article.excerpt}
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-[#18181B]/8 pt-4">
                            {renderMetaRow()}
                            <span className="inline-flex items-center gap-1.5 font-inter-tight text-sm font-semibold text-[#111827] transition-transform duration-300 group-hover:translate-x-0.5">
                                Read dispatch
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        </div>
                    </div>

                    <div className="overflow-hidden border-t border-[#18181B]/10 bg-[#F4F4F5] xl:border-l xl:border-t-0">
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            className="h-full max-h-[208px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] sm:max-h-[240px] xl:max-h-none"
                            loading="lazy"
                            onError={handleImgError}
                        />
                    </div>
                </div>
            </a>
        );
    }

    if (isSupport) {
        return (
            <a
                href={`/insights/${article.slug}`}
                className="group grid grid-cols-[100px_minmax(0,1fr)] overflow-hidden rounded-[24px] border border-[#18181B]/10 bg-[#faf7f5] text-[#111827] transition-all duration-300 hover:border-[#18181B]/16 hover:bg-white hover:shadow-[0_8px_30px_-18px_rgba(0,0,0,0.12)] sm:grid-cols-[120px_minmax(0,1fr)]"
            >
                <div className="overflow-hidden bg-[#F4F4F5]">
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                        onError={handleImgError}
                    />
                </div>

                <div className="flex min-w-0 flex-col gap-3 p-3.5 sm:p-4">
                    {renderLabelRow(true)}

                    <h3 className="text-[0.98rem] leading-[1.17] text-[#111827] sm:text-[1.02rem]">
                        {article.title}
                    </h3>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#18181B]/8 pt-3">
                        {renderMetaRow(true)}
                        <span className="inline-flex items-center gap-1.5 font-inter-tight text-[12px] font-semibold text-[#111827] transition-transform duration-300 group-hover:translate-x-0.5">
                            Read
                            <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                    </div>
                </div>
            </a>
        );
    }

    if (isArchive) {
        return (
            <a
                href={`/insights/${article.slug}`}
                className="group grid grid-cols-[80px_minmax(0,1fr)] overflow-hidden rounded-[22px] border border-[#18181B]/10 bg-white/76 text-[#111827] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#18181B]/16 hover:bg-white hover:shadow-[0_12px_36px_-16px_rgba(0,0,0,0.12)] sm:grid-cols-[100px_minmax(0,1fr)]"
            >
                <div className="overflow-hidden bg-[#F4F4F5]">
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        loading="lazy"
                        onError={handleImgError}
                    />
                </div>

                <div className="flex min-w-0 flex-col gap-3 p-4 sm:p-5">
                    {renderLabelRow(true)}

                    <div className="space-y-2">
                        <h3 className="text-[1.06rem] leading-[1.16] text-[#111827] sm:text-[1.1rem]">
                            {article.title}
                        </h3>
                        <p className="hidden font-['DM_Sans',Helvetica] text-[0.9rem] leading-6 text-[#63636B] lg:block">
                            {article.excerpt}
                        </p>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#18181B]/8 pt-3">
                        {renderMetaRow(true)}
                        <span className="inline-flex items-center gap-1.5 font-inter-tight text-[12px] font-semibold text-[#111827] transition-transform duration-300 group-hover:translate-x-0.5">
                            Read
                            <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                    </div>
                </div>
            </a>
        );
    }

    return (
        <a
            href={`/insights/${article.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-[#18181B]/10 bg-white text-[#111827] shadow-[0_18px_60px_-50px_rgba(15,15,15,0.26)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#18181B]/18 hover:shadow-[0_24px_80px_-54px_rgba(15,15,15,0.3)]"
        >
            <div className="aspect-[16/10] overflow-hidden bg-[#F4F4F5]">
                <img
                    src={article.coverImage}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                    onError={handleImgError}
                />
            </div>

            <div className="flex flex-1 flex-col gap-4 p-5">
                {renderLabelRow()}

                <div className="space-y-2">
                    <h3 className="text-[1.08rem] leading-[1.12] text-[#111827]">
                        {article.title}
                    </h3>
                    <p className="font-['DM_Sans',Helvetica] text-[0.95rem] leading-7 text-[#52525b]">
                        {article.excerpt}
                    </p>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#18181B]/8 pt-3">
                    {renderMetaRow()}
                    <span className="inline-flex items-center gap-1.5 font-inter-tight text-sm font-semibold text-[#111827] transition-transform duration-300 group-hover:translate-x-0.5">
                        Read
                        <ArrowRight className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </a>
    );
};
