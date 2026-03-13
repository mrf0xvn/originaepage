import React from 'react';
import { motion, Variants } from 'framer-motion';

const marketingCards = [
    "Launch & go to market for new products/markets",
    "Building a repeatable\ndemand engine",
    "Content & Brand\nmessaging foundations",
    "Marketing operations\n& Automations",
];

const operationsCards = [
    "Process mapping & Sops\nfor key workflows",
    "Reporting & KPI dashboard\nfor leadership",
    "Setting up a remote\noperations POD",
    "Support / success desk\nstructure and run",
];

const bizDevCards = [
    "Outbound engine: ICP, lists,\nmessaging, cadences",
    "Partnership &\nchannel development",
    "Pipeline build and\ndeal support",
    "CRM management and\ndeal momentum",
];

const productTechCards = [
    "AI & automation for key\nworkflows",
    "Digital product / MVP builds\n(Web / SAAS)",
    "System & Integration: \nMaking tools talk to each other",
    "Dev shop for any custom\nbuilds and solutions",
];

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.15,
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const renderCards = (cards: string[], dark: boolean) => {
    const cardBg = dark ? "bg-[#252525]" : "bg-white";
    const cardBorder = dark ? "border-[#A1A1AA]" : "border-[#D4D4D8]";
    const textColor = dark ? "text-white" : "text-black";

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 w-full lg:w-3/5 shrink-0">
            {cards.map((text, idx) => (
                <motion.div
                    key={idx}
                    variants={cardVariants}
                    className={`flex flex-col items-center justify-center p-6 lg:p-10 min-h-[140px] rounded-3xl border ${cardBorder} ${cardBg} card-soft shadow-sm cursor-default`}
                >
                    <p className={`font-['Inter_Tight-Regular',Helvetica] ${textColor} text-base lg:text-lg text-center leading-relaxed whitespace-pre-line`}>
                        {text}
                    </p>
                </motion.div>
            ))}
        </div>
    );
};

export const ServiceDetailsSection = (): JSX.Element => {
    return (
        <section className="w-full bg-white flex flex-col items-center py-10 lg:py-20 relative overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 flex flex-col">
                
                {/* Marketing Section */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                    className="relative z-10 flex flex-col lg:flex-row items-start justify-between p-8 lg:p-12 gap-8 lg:gap-16 bg-[#F2F2F2] rounded-t-3xl sm:rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                    <div className="flex flex-col gap-6 lg:gap-8 w-full lg:w-2/5">
                        <motion.h2 variants={cardVariants} className="font-['Inter_Tight-Regular',Helvetica] text-black text-4xl lg:text-6xl pt-2">
                            Marketing
                        </motion.h2>
                        <motion.p variants={cardVariants} className="font-['Inter_Tight-Regular',Helvetica] text-black text-xl lg:text-2xl leading-relaxed">
                            We're not here to brainstorm endlessly; we're here to
                            pick a target and build a system that creates conversion.
                        </motion.p>
                    </div>
                    {renderCards(marketingCards, false)}
                </motion.div>

                {/* Operations Section */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                    className="relative z-20 flex flex-col lg:flex-row items-start justify-between p-8 lg:p-12 gap-8 lg:gap-16 bg-black sm:rounded-3xl rounded-t-3xl shadow-lg -mt-6 hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col gap-6 lg:gap-8 w-full lg:w-2/5">
                        <motion.h2 variants={cardVariants} className="font-['Inter_Tight-Regular',Helvetica] text-white text-4xl lg:text-6xl pt-2">
                            Operations
                        </motion.h2>
                        <motion.p variants={cardVariants} className="font-['Inter_Tight-Regular',Helvetica] text-white text-xl lg:text-2xl leading-relaxed">
                            The business is growing but internally things feel messy. We bring
                            order and eliminate the chaos.
                        </motion.p>
                    </div>
                    {renderCards(operationsCards, true)}
                </motion.div>

                {/* Business Development Section */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                    className="relative z-30 flex flex-col lg:flex-row items-start justify-between p-8 lg:p-12 gap-8 lg:gap-16 bg-[#F2F2F2] sm:rounded-3xl rounded-t-3xl shadow-lg -mt-6 hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col gap-6 lg:gap-8 w-full lg:w-2/5">
                        <motion.h2 variants={cardVariants} className="font-['Inter_Tight-Regular',Helvetica] text-black text-4xl lg:text-6xl pt-2">
                            Business<br className="hidden lg:block"/> Development
                        </motion.h2>
                        <motion.p variants={cardVariants} className="font-['Inter_Tight-Regular',Helvetica] text-black text-xl lg:text-2xl leading-relaxed">
                            You need more conversations with the right targets. We focus on
                            filling the pipeline and closing deals.
                        </motion.p>
                    </div>
                    {renderCards(bizDevCards, false)}
                </motion.div>

                {/* Product & Technology Section */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                    className="relative z-40 flex flex-col lg:flex-row items-start justify-between p-8 lg:p-12 gap-8 lg:gap-16 bg-black sm:rounded-3xl rounded-t-3xl shadow-lg -mt-6 mb-10 hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col gap-6 lg:gap-8 w-full lg:w-2/5">
                        <motion.h2 variants={cardVariants} className="font-['Inter_Tight-Regular',Helvetica] text-white text-4xl lg:text-6xl pt-2">
                            Product &amp;<br />
                            Technology
                        </motion.h2>
                        <motion.p variants={cardVariants} className="font-['Inter_Tight-Regular',Helvetica] text-white text-xl lg:text-2xl leading-relaxed">
                            Avoid the never-ending dev rabbit hole. We sit between business
                            &amp; engineering to ensure what gets built moves the needle.
                        </motion.p>
                    </div>
                    {renderCards(productTechCards, true)}
                </motion.div>
                
            </div>
        </section>
    );
};
