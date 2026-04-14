import { CallToActionSection } from "./CallToActionSection";
import { FeaturedProjectsSection } from "./FeaturedProjectsSection";
import { GetStartedSection } from "./GetStartedSection";
import { HeroSection } from "./HeroSection";
import { ServiceDetailsSection } from "./ServiceDetailsSection";
import { ServiceModelSection } from "./ServiceModelSection";
import { ServicesOverviewSection } from "./ServicesOverviewSection";
import { SiteHeader } from "./site/SiteHeader";
import { TeamSection } from "./TeamSection";

export const LandingPage = (): JSX.Element => {
    return (
        <div className="flex flex-col w-full min-h-screen relative bg-white overflow-x-hidden font-inter-tight">
            <HeroSection headerSlot={<SiteHeader currentPath="/" overlay />} />
            <ServicesOverviewSection />
            <ServiceDetailsSection />
            <CallToActionSection />
            <ServiceModelSection />
            <FeaturedProjectsSection />
            <TeamSection />
            <GetStartedSection />
        </div>
    );
};
