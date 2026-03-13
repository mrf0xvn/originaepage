import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const CaretDown = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
        <path d="M8 12L16 20L24 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const serviceSteps = [
    { number: "(01)", title: "Kick off", description: null },
    {
        number: "(02)",
        title: "Engage",
        description: "Each project is led by a Swiss-based mandate lead and supported by a dedicated team, following a clear execution plan with defined milestones to ensure structured and reliable delivery.",
    },
    { number: "(03)", title: "Deliver", description: null },
    { number: "(04)", title: "Review & Extend", description: null },
];

const mandateCards = [
    {
        title: "Fixed-scope mandates",
        description: "For clearly defined projects\nwith a clear end state.",
        bg: "bg-white",
        titleColor: "text-black",
        descColor: "text-black",
        borderClass: "border border-[#D4D4D8]",
        zIndex: "z-10",
    },
    {
        title: "Pilot /\nMVP-first",
        description: "For recurring functions that\nneed consistent execution.",
        bg: "bg-[#F2F2F2]",
        titleColor: "text-black",
        descColor: "text-black",
        borderClass: "border border-transparent",
        zIndex: "z-20",
    },
    {
        title: "Ongoing manage mandates",
        description: "Start with a smaller, time-bound mandate to prove value.",
        bg: "bg-[#18181B]",
        titleColor: "text-white",
        descColor: "text-white",
        borderClass: "border border-transparent",
        zIndex: "z-30",
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15, duration: 0.5, ease: "easeOut" }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
};

export const ServiceModelSection = (): JSX.Element => {
    const [openIndex, setOpenIndex] = useState<number | null>(1);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full bg-white flex flex-col items-center overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-20 py-16 lg:py-20 flex flex-col gap-16">
                
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#A1A1AA]">
                    <div className="flex flex-col gap-4 lg:gap-6 max-w-lg">
                        <p className="font-['Inter_Tight-SemiBold',Helvetica] font-semibold text-black text-xl lg:text-2xl tracking-[0] uppercase">
                            OUR SERVICE MODEL:
                        </p>
                        <h2 className="font-['Inter_Tight-Regular',Helvetica] font-normal text-black text-4xl lg:text-6xl leading-tight">
                            Simple &amp; Accountable
                        </h2>
                    </div>

                    <div className="flex flex-col gap-2 max-w-xl">
                        <p className="font-['Inter_Tight-Regular',Helvetica] text-black text-xl lg:text-[32px] leading-snug">
                            We offer a modular model, where we start small, prove value, and
                            then expand.
                        </p>
                    </div>
                </div>

                {/* Content Split */}
                <motion.div 
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                    variants={containerVariants}
                    className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-start justify-between w-full"
                >
                    
                    {/* Steps Accordion */}
                    <div className="flex flex-col w-full lg:w-1/2">
                        {serviceSteps.map((step, index) => {
                            const isOpen = openIndex === index;
                            const hasDescription = !!step.description;
                            const isLast = index === serviceSteps.length - 1;

                            return (
                                <motion.div variants={itemVariants} key={index} className={`flex flex-col py-6 lg:py-8 w-full ${!isLast ? "border-b border-[#A1A1AA]" : ""}`}>
                                    <button
                                        className="flex items-center justify-between w-full bg-transparent border-none cursor-pointer p-0 group"
                                        onClick={() => handleToggle(index)}
                                        aria-expanded={isOpen}
                                    >
                                        <div className="flex items-center gap-6 lg:gap-14">
                                            <span className={`font-['Inter_Tight-Regular',Helvetica] text-xl lg:text-2xl transition-colors duration-300 ${isOpen || !hasDescription ? 'text-black opacity-100' : 'text-black opacity-40 group-hover:opacity-70'}`}>
                                                {step.number}
                                            </span>
                                            <span className={`font-['Inter_Tight-SemiBold',Helvetica] font-semibold text-2xl lg:text-3xl transition-colors duration-300 ${isOpen || !hasDescription ? 'text-black' : 'text-black opacity-40 group-hover:opacity-70'}`}>
                                                {step.title}
                                            </span>
                                        </div>

                                        {hasDescription && (
                                            <motion.div 
                                                className="text-black ml-4"
                                                animate={{ rotate: isOpen ? 180 : 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <CaretDown className="w-8 h-8 opacity-60 group-hover:opacity-100 transition-opacity" />
                                            </motion.div>
                                        )}
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && hasDescription && (
                                            <motion.div
                                                initial="collapsed"
                                                animate="open"
                                                exit="collapsed"
                                                variants={{
                                                    open: { opacity: 1, height: "auto", marginTop: 24 },
                                                    collapsed: { opacity: 0, height: 0, marginTop: 0 }
                                                }}
                                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                            >
                                                <div className="pl-0 sm:pl-[104px]">
                                                    <p className="font-['Inter_Tight-Regular',Helvetica] text-black text-lg lg:text-xl leading-relaxed max-w-md text-left">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Mandate Cards Stack */}
                    <div className="flex flex-col w-full lg:w-5/12 pt-4">
                        {mandateCards.map((card, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 p-8 lg:p-10 w-full ${card.bg} ${card.borderClass} ${card.zIndex} relative shadow-sm ${index !== 0 ? "-mt-6 lg:-mt-8" : ""} ${index === mandateCards.length - 1 ? "rounded-3xl" : "rounded-t-3xl sm:rounded-3xl"} hover:-translate-y-2 hover:shadow-xl hover:!z-50 transition-all duration-300 group`}
                            >
                                <h3 className={`font-['Inter_Tight-SemiBold',Helvetica] font-semibold ${card.titleColor} text-2xl w-full sm:w-1/2 group-hover:scale-105 origin-left transition-transform duration-300`}>
                                    {card.title.split("\n").map((line, i, arr) => (
                                        <span key={i}>
                                            {line}
                                            {i < arr.length - 1 && <br className="hidden sm:block"/>}
                                        </span>
                                    ))}
                                </h3>
                                
                                <p className={`font-['Inter_Tight-Regular',Helvetica] ${card.descColor} text-lg leading-relaxed w-full sm:w-1/2 opacity-90 group-hover:opacity-100 transition-opacity duration-300`}>
                                    {card.description.split("\n").map((line, i, arr) => (
                                        <span key={i}>
                                            {line}
                                            {i < arr.length - 1 && <br className="hidden sm:block"/>}
                                        </span>
                                    ))}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </div>
        </section>
    );
};
