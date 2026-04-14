import { useEffect } from "react";
import { LandingPage } from "./index.tsx";
import { getInsightByPath, normalizePath } from "./content/originaeInsights.ts";
import { InsightArticlePage } from "./insights/InsightArticlePage.tsx";
import { InsightsIndexPage } from "./insights/InsightsIndexPage.tsx";
import { NotFoundPage } from "./site/NotFoundPage.tsx";
import { SiteHeader } from "./site/SiteHeader.tsx";
import { SiteShell } from "./site/SiteShell.tsx";

export const App = (): JSX.Element => {
    const currentPath = normalizePath(window.location.pathname);
    const article = getInsightByPath(currentPath);
    const editorialFooterVariant =
        currentPath === "/insights" ? "editorial" : "editorial-lite";
    const renderEditorialShell = (content: JSX.Element) => (
        <SiteShell
            currentPath={currentPath}
            header={<SiteHeader currentPath={currentPath} mode="editorial" />}
            footerVariant={editorialFooterVariant}
        >
            {content}
        </SiteShell>
    );

    useEffect(() => {
        if (currentPath !== "/" || !window.location.hash) return;

        const targetId = decodeURIComponent(window.location.hash.replace(/^#/, ""));
        const scrollToTarget = () => {
            document.getElementById(targetId)?.scrollIntoView({
                behavior: "auto",
                block: "start",
            });
        };

        window.setTimeout(scrollToTarget, 120);
    }, [currentPath]);

    if (currentPath === "/") {
        return (
            <SiteShell currentPath="/">
                <LandingPage />
            </SiteShell>
        );
    }

    if (currentPath === "/insights") {
        return renderEditorialShell(<InsightsIndexPage />);
    }

    if (article) {
        return renderEditorialShell(<InsightArticlePage article={article} />);
    }

    return renderEditorialShell(<NotFoundPage />);
};
