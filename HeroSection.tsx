import { ArrowRight } from "./ArrowRight";
import image21 from "./image-21.png";
import vector1 from "./Vector-1.svg";
import vector2 from "./Vector-2.svg";
import vector3 from "./Vector-3.svg";
import vector4 from "./Vector-4.svg";
import vector5 from "./Vector-5.svg";
import vector6 from "./Vector-6.svg";
import vector7 from "./Vector-7.svg";
import vector from "./Vector.svg";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

const navLinks = ["Service", "Model", "Team"];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
        opacity: 1, 
        y: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 20
        }
    },
};

export const HeroSection = (): JSX.Element => {
    const { scrollY } = useScroll();
    const yBG = useTransform(scrollY, [0, 1000], [0, 200]);
    const scaleBG = useTransform(scrollY, [0, 1000], [1, 1.1]);
    
    return (
        <section className="relative w-full min-h-[100svh] bg-black flex flex-col overflow-hidden">
            {/* Background Image with Parallax */}
            <motion.img
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                alt="Background"
                src={image21}
                style={{ y: yBG, scale: scaleBG }}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col flex-1 w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-8 lg:py-10 justify-between">
                
                {/* Header */}
                <motion.header 
                    className="flex items-center justify-between w-full"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Logo Vectors */}
                    <div className="flex items-center gap-[2px] h-[23px] shrink-0">
                        <img className="w-[13px] h-[22px] object-contain" alt="O" src={vector7} />
                        <img className="w-[13px] h-[22px] object-contain" alt="R" src={vector6} />
                        <img className="w-[4px] h-[22px] object-contain" alt="I" src={vector5} />
                        <img className="w-[13px] h-[22px] object-contain ml-[1px]" alt="G" src={vector4} />
                        <img className="w-[4px] h-[22px] object-contain" alt="I" src={vector3} />
                        <img className="w-[12px] h-[22px] object-contain" alt="N" src={vector2} />
                        <img className="w-[13px] h-[22px] object-contain" alt="A" src={vector1} />
                        <img className="w-[11px] h-[22px] object-contain" alt="E" src={vector} />
                    </div>

                    <nav className="hidden md:flex items-center gap-12 lg:gap-24">
                        {navLinks.map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="font-['Inter_Tight-Regular',Helvetica] font-normal text-white/80 text-sm lg:text-base hover:text-white transition-colors"
                            >
                                {link}
                            </a>
                        ))}
                    </nav>

                    <a
                        href="#"
                        className="hidden sm:flex font-['Inter_Tight-Regular',Helvetica] font-normal text-white/80 text-sm lg:text-base underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white transition-all"
                    >
                        Book a meeting &rarr;
                    </a>
                </motion.header>

                <motion.div 
                    className="flex flex-col flex-1 w-full mt-10 md:mt-16 lg:mt-20 xl:mt-24"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {/* Middle Content */}
                    <motion.div className="flex flex-col w-full xl:max-w-[1200px]" variants={itemVariants}>
                        <p className="font-['Inter_Tight-Regular',Helvetica] font-normal text-white text-[24px] sm:text-[32px] md:text-[38px] lg:text-[42px] xl:text-[46px] leading-[1.2] tracking-tight">
                            Important initiatives get stuck due to a lack of capacity.<br className="hidden xl:block"/>
                            From "we should do this" to "it's live". We assemble the<br className="hidden xl:block"/>
                            team, manage the work, and move your business<br className="hidden xl:block"/>
                            forward immediately.
                        </p>
                        
                        <div className="mt-8 md:mt-12">
                            <button className="flex items-center gap-4 pl-6 pr-2 py-2 bg-white rounded-full hover:scale-105 transition-transform w-fit group">
                                <span className="font-['Inter_Tight-Medium',Helvetica] font-medium text-black text-sm md:text-base">
                                    Book a meeting
                                </span>
                                <div className="bg-black text-white rounded-full p-2.5 flex items-center justify-center">
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" color="currentColor" />
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    {/* Bottom Content */}
                    <motion.div className="flex flex-col w-full mt-auto pt-8 md:pt-12" variants={itemVariants}>
                        <h1 className="whitespace-nowrap font-['Inter_Tight-Medium',Helvetica] font-medium text-white text-[13vw] sm:text-[11vw] md:text-[10vw] lg:text-[9.5vw] xl:text-[125px] 2xl:text-[135px] leading-[0.8] tracking-[-0.04em] w-full text-left drop-shadow-2xl">
                            We solve it for you
                        </h1>
                        
                        <div className="flex items-center justify-between w-full mt-6 md:mt-8 pb-4 md:pb-6">
                            <span className="font-['Inter_Tight-Regular',Helvetica] text-white/60 text-xs sm:text-sm">
                                2026 All Rights Reserved
                            </span>
                            <span className="font-['Inter_Tight-Regular',Helvetica] text-white/60 text-xs sm:text-sm">
                                {'{Scroll down}'}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
};
