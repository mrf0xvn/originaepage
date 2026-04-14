import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getInsightBySlug } from "../content/originaeInsights.ts";
import { InsightArticlePage } from "../insights/InsightArticlePage.tsx";
import { InsightsIndexPage } from "../insights/InsightsIndexPage.tsx";
import { SiteHeader } from "../site/SiteHeader.tsx";
import { SiteShell } from "../site/SiteShell.tsx";

function renderEditorialShell(currentPath: string, content: React.ReactElement) {
    const footerVariant =
        currentPath === "/insights" ? "editorial" : "editorial-lite";

    return renderToStaticMarkup(
        <SiteShell
            currentPath={currentPath}
            header={<SiteHeader currentPath={currentPath} mode="editorial" />}
            footerVariant={footerVariant}
        >
            {content}
        </SiteShell>,
    );
}

export function renderInsightsIndex() {
    return renderEditorialShell("/insights", <InsightsIndexPage />);
}

export function renderInsightArticle(slug: string) {
    const article = getInsightBySlug(slug);
    if (!article) {
        throw new Error(`Missing insight article for slug: ${slug}`);
    }

    return renderEditorialShell(
        `/insights/${slug}`,
        <InsightArticlePage article={article} />,
    );
}
