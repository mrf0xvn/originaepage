import { motion } from "framer-motion";
import { ArrowRight } from "./ArrowRight";
import vector1 from "./CTA_SVG/Vector-1.svg";
import vector2 from "./CTA_SVG/Vector-2.svg";
import vector3 from "./CTA_SVG/Vector-3.svg";
import vector4 from "./CTA_SVG/Vector-4.svg";
import vector5 from "./CTA_SVG/Vector-5.svg";
import vector6 from "./CTA_SVG/Vector-6.svg";
import vector7 from "./CTA_SVG/Vector-7.svg";
import vector from "./CTA_SVG/Vector.svg";
import CTA_background from "./CTA_background.jpg";

export const CallToActionSection = (): JSX.Element => {
    return (
        <section className="relative w-full min-h-[420px] sm:min-h-[500px] flex flex-col items-center justify-center pt-20 sm:pt-24 md:pt-32 pb-0 px-5 sm:px-6 overflow-hidden">
            {/* Background Image */}
            <img
                className="absolute inset-0 w-full h-full object-cover z-0"
                src={CTA_background}
                alt=""
                loading="lazy"
                decoding="async"
            />
            
            {/* Gradient Overlay */}
            <div 
                className="absolute inset-0 w-full h-full z-0"
                style={{ 
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0.9) 100%)' 
                }}
            />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 md:gap-10 w-full max-w-4xl mx-auto">
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="font-['Inter_Tight-Regular',Helvetica] font-normal text-white text-[24px] sm:text-[28px] md:text-4xl lg:text-[42px] text-center leading-[1.35] sm:leading-[1.3] px-1"
                >
                    Learn more about our managed services{" "}
                    <br className="hidden md:block"/>
                    and speak to a member of our team:
                </motion.h2>

                <motion.a 
                    href="https://calendly.com/originae"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                    transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 100 }}
                    className="btn-primary group"
                >
                    <span className="btn-text font-inter-tight font-semibold text-sm md:text-base whitespace-nowrap">
                        Book a meeting
                    </span>
                    <div className="btn-arrow-circle">
                        <ArrowRight className="btn-arrow-icon w-5 h-5 arrow-pulse" color="currentColor" />
                    </div>
                </motion.a>
            </div>

            {/* Huge ORIGINAE Background Logo */}
            <div className="relative z-10 w-full max-w-[1440px] px-2 sm:px-6 mx-auto mt-10 sm:mt-16 md:mt-24 pointer-events-none flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 0.2, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px 50px 0px" }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="flex justify-between items-end w-full mix-blend-overlay h-[60px] sm:h-[120px] md:h-[200px] lg:h-[280px] gap-[1px] sm:gap-1"
                >
                    <img className="h-full w-auto min-w-0 flex-shrink" alt="O" src={vector7} />
                    <img className="h-full w-auto min-w-0 flex-shrink" alt="R" src={vector6} />
                    <img className="h-full w-auto min-w-0 flex-shrink" alt="I" src={vector5} />
                    <img className="h-full w-auto min-w-0 flex-shrink" alt="G" src={vector4} />
                    <img className="h-full w-auto min-w-0 flex-shrink" alt="I" src={vector3} />
                    <img className="h-full w-auto min-w-0 flex-shrink" alt="N" src={vector2} />
                    <img className="h-full w-auto min-w-0 flex-shrink" alt="A" src={vector1} />
                    <img className="h-full w-auto min-w-0 flex-shrink" alt="E" src={vector} />
                </motion.div>
            </div>
        </section>
    );
};
