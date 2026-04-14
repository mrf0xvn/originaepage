import curatedInsightSlugs from "./curatedInsightSlugs.json";
import snapshot from "./generated/originae-insights.snapshot.json";

export type OriginaeTopicSlug =
    | "growth-systems"
    | "operations-automation"
    | "gtm-execution"
    | "product-delivery"
    | "case-notes";

export interface InsightHeading {
    id: string;
    level: 2 | 3;
    text: string;
}

export interface OriginaeInsightArticle {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    publishedAt: string;
    readTime: number;
    sourceName: string;
    sourceUrl: string;
    seoTitle: string;
    seoDescription: string;
    bodyHtml: string;
    headings: InsightHeading[];
    tags: string[];
    keyTakeaways: string[];
    topic: OriginaeTopicSlug;
    topicName: string;
    topicAccent: string;
    serviceSlug: string;
    serviceName: string;
    categorySlug: string | null;
    label: string | null;
    language: string;
}

export interface OriginaeTopicDefinition {
    slug: OriginaeTopicSlug;
    name: string;
    description: string;
    accent: string;
    serviceSlug: string;
    serviceName: string;
}

export const ORIGINAE_TOPICS: OriginaeTopicDefinition[] = [
    {
        slug: "growth-systems",
        name: "Growth systems",
        description:
            "Messaging, demand systems, and repeatable operator-grade growth mechanics.",
        accent: "#F26522",
        serviceSlug: "marketing",
        serviceName: "Marketing",
    },
    {
        slug: "operations-automation",
        name: "Operations & automation",
        description:
            "Execution systems, process design, and leverage across internal workflows.",
        accent: "#18181B",
        serviceSlug: "operations",
        serviceName: "Operations",
    },
    {
        slug: "gtm-execution",
        name: "GTM execution",
        description:
            "Outbound motion, pipeline building, and go-to-market operating notes.",
        accent: "#252525",
        serviceSlug: "business-development",
        serviceName: "Business Development",
    },
    {
        slug: "product-delivery",
        name: "Product delivery",
        description:
            "Applied AI, systems integration, and practical delivery decisions that get shipped.",
        accent: "#F26522",
        serviceSlug: "product-technology",
        serviceName: "Product & Technology",
    },
    {
        slug: "case-notes",
        name: "Case notes",
        description:
            "Market observations and strategic notes from the edge of delivery work.",
        accent: "#18181B",
        serviceSlug: "business-development",
        serviceName: "Business Development",
    },
];

export const CURATED_INSIGHT_SLUGS = curatedInsightSlugs as string[];

const articles = (snapshot.articles as OriginaeInsightArticle[]) ?? [];
const slugOrder = new Map(
    CURATED_INSIGHT_SLUGS.map((slug, index) => [slug, index]),
);

export const originaeInsights = [...articles].sort((left, right) => {
    const leftOrder = slugOrder.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = slugOrder.get(right.slug) ?? Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
});

const insightsBySlug = new Map(
    originaeInsights.map((article) => [article.slug, article]),
);

export function normalizePath(pathname: string) {
    if (!pathname || pathname === "/") return "/";

    const decodedPath = decodeURIComponent(pathname);
    const trimmed = decodedPath.replace(/\/+$/, "");
    return trimmed.length > 0 ? trimmed : "/";
}

export function getInsightBySlug(slug: string) {
    return insightsBySlug.get(slug);
}

export function getInsightByPath(pathname: string) {
    const normalizedPath = normalizePath(pathname);

    if (!normalizedPath.startsWith("/insights/")) return undefined;

    const slug = normalizedPath.slice("/insights/".length);
    return getInsightBySlug(slug);
}

export function getRelatedInsights(
    article: OriginaeInsightArticle,
    limit = 3,
) {
    const sameTopic = originaeInsights.filter(
        (candidate) =>
            candidate.slug !== article.slug && candidate.topic === article.topic,
    );

    const fallbacks = originaeInsights.filter(
        (candidate) =>
            candidate.slug !== article.slug &&
            !sameTopic.some((match) => match.slug === candidate.slug),
    );

    return [...sameTopic, ...fallbacks].slice(0, limit);
}
