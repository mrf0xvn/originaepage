import { ArrowRight } from "./ArrowRight";

const steps = [
    {
        number: "(01)",
        text: "You share where you're stuck or what you want to achieve.",
        hasBorder: true,
    },
    {
        number: "(02)",
        text: "We propose a tailored mandate with scope, duration, & outcomes.",
        hasBorder: true,
    },
    {
        number: "(03)",
        text: "We agree on a start date and get moving",
        hasBorder: false,
    },
];

const cards = [
    {
        title: "Outcome-first",
        description: "Clear mandates with defined success metrics.",
        isLast: false,
    },
    {
        title: "High caliber talent",
        description: "Degree-educated specialists matched to you problem",
        isLast: false,
    },
    {
        title: "Swiss-based leadership",
        description: "Stable, accountable management and communication.",
        isLast: false,
    },
    {
        title: "Modular engagement",
        description: "Start with one mandate, expand as needed.",
        isLast: false,
    },
    {
        title: "Cost-effective",
        description: "Get a fully managed team on a flexible month-to-month payment.",
        isLast: true,
    },
];

export const GetStartedSection = (): JSX.Element => {
    return (
        <section className="w-full bg-black flex flex-col items-center overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-20 py-16 lg:py-20 flex flex-col lg:flex-row gap-16 lg:gap-24">
                
                {/* Left Side: Header & Steps */}
                <div className="flex flex-col flex-1 gap-12 lg:gap-20">
                    {/* Header */}
                    <div className="flex flex-col items-start gap-8 lg:gap-10">
                        <h2 className="font-['Inter_Tight-Regular',Helvetica] font-normal text-white text-4xl lg:text-6xl leading-tight">
                            Let's get started
                        </h2>

                        <button className="btn-primary group">
                            <span className="btn-text font-inter-tight font-semibold text-base md:text-lg whitespace-nowrap">
                                Book a call now
                            </span>
                            <div className="btn-arrow-circle">
                                <ArrowRight className="btn-arrow-icon w-5 h-5 arrow-pulse" color="currentColor" />
                            </div>
                        </button>
                    </div>

                    {/* Steps */}
                    <div className="flex flex-col w-full">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`flex flex-col py-6 lg:py-8 w-full ${step.hasBorder ? "border-b border-[#A1A1AA]" : ""}`}
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10 lg:gap-14">
                                    <span className="font-['Inter_Tight-Regular',Helvetica] text-white text-xl lg:text-2xl opacity-70 whitespace-nowrap">
                                        {step.number}
                                    </span>
                                    <p className="font-['Inter_Tight-SemiBold',Helvetica] font-semibold text-white text-xl lg:text-2xl leading-snug">
                                        {step.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Feature Cards */}
                <div className="flex flex-col w-full lg:w-5/12 pt-4 relative">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 p-6 lg:p-8 w-full bg-[#252525] border border-[#D4D4D8] shadow-sm relative ${index !== 0 ? "-mt-4 lg:-mt-6" : ""} ${card.isLast ? "rounded-3xl" : "rounded-t-3xl sm:rounded-3xl"} card-soft`}
                            style={{ zIndex: 10 + index }}
                        >
                            <h3 className="font-['Inter_Tight-SemiBold',Helvetica] font-semibold text-white text-xl lg:text-2xl w-full sm:w-2/5 shrink-0">
                                {card.title}
                            </h3>
                            <p className="font-['Inter_Tight-Regular',Helvetica] font-normal text-white text-base lg:text-lg leading-relaxed w-full sm:w-3/5">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};
