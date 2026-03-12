import React from 'react';
import { motion, Variants } from "framer-motion";

const vector206 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='1'%3E%3Cline x1='0' y1='0' x2='100%25' y2='0' stroke='%23b1b1b1' stroke-width='1'/%3E%3C/svg%3E";

const serviceCards = [
    {
        number: "01",
        title: "Outcome-driven",
        description: "We set clear objectives and measurable success metrics to ensure every project delivers real, trackable results.",
        bgCard: "bg-white border border-[#b1b1b1] shadow-sm",
        bgBadge: "bg-[#f0ebea]",
        textBadge: "text-black",
    },
    {
        number: "02",
        title: "Fully Managed",
        description: "Led by Swiss-based leadership, we provide structured, end-to-end management with full transparency and accountability.",
        bgCard: "bg-[#f0ebea] border border-transparent shadow-sm",
        bgBadge: "bg-[#e54e05]",
        textBadge: "text-white",
    },
    {
        number: "03",
        title: "Specialized",
        description: "Our degree-educated professionals combine strong academic foundations with hands-on expertise to deliver high-quality work.",
        bgCard: "bg-white border border-[#b1b1b1] shadow-sm",
        bgBadge: "bg-[#f0ebea]",
        textBadge: "text-black",
    },
];

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { 
        opacity: 1, 
        y: 0,
        transition: { type: "spring", stiffness: 60, damping: 20 }
    }
};

export const ServicesOverviewSection = (): JSX.Element => {
    return (
        <section className="w-full bg-white flex flex-col items-center">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-20 py-16 lg:py-20 flex flex-col gap-16">
                
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#7b7b7b]">
                    <div className="flex flex-col gap-4 lg:gap-6 max-w-lg">
                        <p className="font-['Inter_Tight-SemiBold',Helvetica] font-semibold text-black text-lg lg:text-2xl tracking-[0] uppercase">
                            OUR ANSWER:
                        </p>
                        <h2 className="font-['Inter_Tight-Regular',Helvetica] font-normal text-black text-4xl lg:text-6xl leading-tight">
                            Outcome driven Services
                        </h2>
                    </div>

                    <div className="flex flex-col gap-2 max-w-xl">
                        <p className="font-['Inter_Tight-Regular',Helvetica] text-black text-xl lg:text-[32px] leading-snug">
                            We let you focus on your business, while we handle the rest.
                        </p>
                        <p className="font-['Inter_Tight-Regular',Helvetica] text-black text-xl lg:text-[32px] leading-snug">
                            We are a specialized managed services provider.
                        </p>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">
                    {serviceCards.map((card, index) => (
                        <motion.div
                            key={card.number}
                            className={`flex flex-col gap-6 p-8 lg:p-10 rounded-3xl h-full ${card.bgCard} card-soft group`}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                            custom={index}
                        >
                            <div className={`flex items-center justify-center w-16 h-16 rounded-full ${card.bgBadge} group-hover:scale-110 transition-transform duration-300`}>
                                <span className={`font-['Inter_Tight-Regular',Helvetica] text-2xl ${card.textBadge}`}>
                                    {card.number}
                                </span>
                            </div>

                            <h3 className="font-['Inter_Tight-Medium',Helvetica] font-medium text-black text-2xl group-hover:text-black/80 transition-colors">
                                {card.title}
                            </h3>

                            <div className="w-full h-px opacity-50 bg-repeat-x" style={{ backgroundImage: `url("${vector206}")` }}></div>

                            <p className="font-['Inter_Tight-Regular',Helvetica] text-[#2c2c2c] text-lg leading-relaxed mix-blend-multiply">
                                {card.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
