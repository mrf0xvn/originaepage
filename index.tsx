import { CallToActionSection } from "./CallToActionSection";
import { FooterSection } from "./FooterSection";
import { GetStartedSection } from "./GetStartedSection";
import { HeroSection } from "./HeroSection";
import { ServiceDetailsSection } from "./ServiceDetailsSection";
import { ServiceModelSection } from "./ServiceModelSection";
import { ServicesOverviewSection } from "./ServicesOverviewSection";
import { TeamSection } from "./TeamSection";

export const LandingPage = (): JSX.Element => {
    return (
        <div className="flex flex-col w-full min-h-screen relative bg-white overflow-x-hidden font-inter-tight">
            <HeroSection />
            <ServicesOverviewSection />
            <ServiceDetailsSection />
            <CallToActionSection />
            <ServiceModelSection />
            <TeamSection />
            <GetStartedSection />
            <FooterSection />
        </div>
    );
};
