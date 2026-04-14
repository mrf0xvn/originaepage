import shellContract from "./shellContract.json";

interface SiteWordmarkProps {
    inverted?: boolean;
}

export const SiteWordmark = ({ inverted = false }: SiteWordmarkProps): JSX.Element => {
    return (
        <span
            className={`font-['Inter_Tight',Helvetica] text-lg font-semibold tracking-[-0.03em] ${
                inverted ? "text-white" : "text-[#111827]"
            }`}
            aria-label={shellContract.heroWordmarkLabel}
        >
            {shellContract.heroWordmarkLabel}
        </span>
    );
};