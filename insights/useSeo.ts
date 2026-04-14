import { useEffect } from "react";

interface SeoConfig {
    title: string;
    description: string;
    canonicalUrl: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
    jsonLd?: Record<string, unknown>;
}

function setMetaTag(
    attribute: "property" | "name",
    key: string,
    content: string,
) {
    let el = document.querySelector(
        `meta[${attribute}="${key}"]`,
    ) as HTMLMetaElement | null;
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attribute, key);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function setCanonical(href: string) {
    let el = document.querySelector(
        'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
    }
    el.setAttribute("href", href);
}

const JSON_LD_ID = "originae-seo-jsonld";

function setJsonLd(data: Record<string, unknown> | null) {
    let el = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
    if (!data) {
        el?.remove();
        return;
    }
    if (!el) {
        el = document.createElement("script");
        el.id = JSON_LD_ID;
        el.type = "application/ld+json";
        document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
}

/**
 * useSeo — Sets dynamic SEO meta tags, canonical URL, and JSON-LD for SPA pages.
 *
 * Because Originae is a React SPA (Vite), the <head> from index.html is shared
 * across all routes. This hook dynamically updates meta tags so each page has
 * unique SEO signals for search engines and social media previews.
 */
export function useSeo(config: SeoConfig) {
    useEffect(() => {
        // Store original values for cleanup
        const originalTitle = document.title;

        // Title
        document.title = config.title;

        // Standard meta
        setMetaTag("name", "description", config.description);

        // Open Graph
        setMetaTag("property", "og:title", config.title);
        setMetaTag("property", "og:description", config.description);
        setMetaTag("property", "og:url", config.canonicalUrl);
        setMetaTag("property", "og:type", config.ogType || "website");
        if (config.ogImage) {
            setMetaTag("property", "og:image", config.ogImage);
        }

        // Twitter
        setMetaTag("name", "twitter:card", config.twitterCard || "summary_large_image");
        setMetaTag("name", "twitter:title", config.title);
        setMetaTag("name", "twitter:description", config.description);
        if (config.ogImage) {
            setMetaTag("name", "twitter:image", config.ogImage);
        }

        // Canonical
        setCanonical(config.canonicalUrl);

        // JSON-LD
        if (config.jsonLd) {
            setJsonLd(config.jsonLd);
        }

        // Cleanup on unmount / route change
        return () => {
            document.title = originalTitle;
            setJsonLd(null);
        };
    }, [
        config.title,
        config.description,
        config.canonicalUrl,
        config.ogImage,
        config.ogType,
        config.twitterCard,
        config.jsonLd,
    ]);
}
