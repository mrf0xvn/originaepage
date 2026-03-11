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
        <section className="relative w-full min-h-[500px] flex flex-col items-center justify-center pt-24 md:pt-32 pb-0 px-6 overflow-hidden">
            {/* Background Image */}
            <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${CTA_background})` }}
            />
            
            {/* Gradient Overlay based on Figma spec: Linear 45% 000000 0% và 69% 000000 100% */}
            <div 
                className="absolute inset-0 w-full h-full z-0"
                style={{ 
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,1) 69%, rgba(0,0,0,1) 100%)' 
                }}
            />

            {/* Content Content Container */}
            <div className="relative z-10 flex flex-col items-center gap-8 md:gap-10 w-full max-w-4xl mx-auto">
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="font-['Inter_Tight-Regular',Helvetica] font-normal text-white text-[28px] sm:text-3xl md:text-4xl lg:text-[42px] text-center leading-[1.3]"
                >
                    Learn more about our managed services
                    <br className="hidden md:block"/>
                    and speak to a member of our team:
                </motion.h2>

                <motion.button 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                    transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-between w-fit gap-4 pl-6 pr-1.5 py-1.5 bg-white rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer group"
                >
                    <span className="font-['Inter_Tight-Medium',Helvetica] font-medium text-black text-sm md:text-base whitespace-nowrap">
                        Book a meeting
                    </span>
                    <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-black rounded-full shrink-0">
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" color="white" />
                    </div>
                </motion.button>
            </div>

            {/* Huge ORIGINAE Background Logo made of existing vectors */}
            <div className="relative z-10 w-full max-w-[1440px] px-6 mx-auto mt-16 md:mt-24 pointer-events-none flex justify-center overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 0.2, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px 50px 0px" }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="flex justify-between items-end w-full mix-blend-overlay h-[100px] sm:h-[150px] md:h-[200px] lg:h-[280px]"
                >
                    <img className="h-full object-contain" alt="O" src={vector7} />
                    <img className="h-full object-contain" alt="R" src={vector6} />
                    <img className="h-full object-contain" alt="I" src={vector5} />
                    <img className="h-full object-contain ml-[1%]" alt="G" src={vector4} />
                    <img className="h-full object-contain" alt="I" src={vector3} />
                    <img className="h-full object-contain" alt="N" src={vector2} />
                    <img className="h-full object-contain" alt="A" src={vector1} />
                    <img className="h-full object-contain" alt="E" src={vector} />
                </motion.div>
            </div>
        </section>
    );
};
