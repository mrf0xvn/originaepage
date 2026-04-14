import { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter.tsx";

interface SiteShellProps {
    currentPath: string;
    header?: ReactNode;
    footerVariant?: "default" | "editorial" | "editorial-lite";
    children: ReactNode;
}

export const SiteShell = ({
    currentPath,
    header,
    footerVariant = "default",
    children,
}: SiteShellProps): JSX.Element => {
    return (
        <div className="min-h-screen bg-white text-[#0f0f0f]">
            {header}
            <main>{children}</main>
            <SiteFooter currentPath={currentPath} variant={footerVariant} />
        </div>
    );
};
