import { motion, Variants } from "framer-motion";
import { AtSign, Mail, ArrowUpRight } from "lucide-react";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export const FooterSection = (): JSX.Element => {
    const services = [
        "Marketing",
        "Operations",
        "Business Development",
        "Product & Technology",
        "Team",
    ];

    const contactItems = [
        { icon: AtSign, text: "@originaeadmin", href: "#" },
        { icon: Mail, text: "hello@originae.org", href: "mailto:hello@originae.org" },
    ];

    const footerLinks = [
        { label: "Privacy Policy", underline: false },
        { label: "Copyright Originae 2026", underline: false },
        { label: "Terms and Conditions", underline: true },
    ];

    return (
        <footer className="w-full bg-[#151515] flex flex-col items-center overflow-hidden border-t border-white/10">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                className="w-full max-w-7xl mx-auto px-6 lg:px-20 py-14 lg:py-20 flex flex-col gap-14 lg:gap-16"
            >
                
                {/* Top Section */}
                <div className="grid w-full grid-cols-1 gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:pb-16 lg:items-start">
                    {/* Services */}
                    <div className="flex flex-col gap-6">
                        <motion.h4 variants={itemVariants} className="font-inter-tight font-semibold text-[#71717A] text-xs lg:text-sm tracking-[0.14em] uppercase">
                            Services
                        </motion.h4>
                        <div className="flex flex-col gap-2.5 lg:gap-3">
                            {services.map((service, index) => (
                                <motion.a
                                    variants={itemVariants}
                                    key={index}
                                    href="#"
                                    className="font-inter-tight font-normal text-[#F5F5F5] text-base lg:text-[18px] hover:text-white hover:translate-x-1.5 transition-all duration-300 whitespace-nowrap w-fit"
                                >
                                    {service}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Contact & Socials */}
                    <div className="flex flex-col w-full gap-6 lg:gap-8">
                        <motion.div variants={itemVariants} className="flex items-center">
                            <p className="font-inter-tight font-medium text-[#71717A] text-xs sm:text-sm tracking-[0.14em] uppercase">
                                Let's get in touch
                            </p>
                        </motion.div>

                        <div className="flex flex-col w-full">
                            {contactItems.map((item, index) => {
                                const IconComp = item.icon;
                                return (
                                    <motion.a
                                        variants={itemVariants}
                                        href={item.href}
                                        key={index}
                                        className={`flex items-center gap-4 sm:gap-5 py-4 sm:py-5 w-full group ${index === 0 ? "border-b border-[#9d9d9e]/30" : ""}`}
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-colors duration-300 group-hover:bg-white/[0.08]">
                                            <IconComp className="w-[18px] h-[18px] text-[#A1A1AA] group-hover:text-[#F5F5F5] transition-all duration-300" />
                                        </div>
                                        <span className="font-inter-tight font-normal text-[#F5F5F5] text-[clamp(20px,2.8vw,34px)] leading-[1.1] tracking-tight truncate group-hover:text-white transition-colors">
                                            {item.text}
                                        </span>
                                    </motion.a>
                                );
                            })}
                        </div>

                        <motion.a 
                            href="#"
                            variants={itemVariants} 
                            className="flex items-center justify-between w-full py-4 border-t border-[#9d9d9e]/30 group cursor-pointer"
                        >
                            <span className="font-inter-tight font-normal text-[#F5F5F5] text-lg sm:text-xl group-hover:text-white transition-colors">
                                Social media
                            </span>
                            <div className="p-2 rounded-full border border-white/10 bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors">
                                <ArrowUpRight className="w-[18px] h-[18px] text-[#A1A1AA] group-hover:text-[#F5F5F5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                            </div>
                        </motion.a>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col items-center gap-10 lg:gap-12">
                    <motion.div variants={itemVariants} className="flex items-center justify-center w-full">
                        <p className="font-['Inter_Tight',Helvetica] font-medium text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-white/30 text-[clamp(38px,7vw,88px)] leading-[0.95] tracking-tighter text-center">
                            We solve it<br className="lg:hidden" /> for you
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between w-full pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2.5">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-[#A1A1AA] text-sm font-inter-tight">All systems operational</span>
                        </div>
                        <div className="flex flex-wrap justify-start sm:justify-end gap-x-5 gap-y-3 sm:gap-x-7">
                            {footerLinks.map((link, index) => (
                                <a
                                    href="#"
                                    key={index}
                                    className={`font-inter-tight font-normal text-[#A1A1AA] text-sm md:text-[15px] hover:text-[#F5F5F5] transition-colors ${link.underline ? "underline underline-offset-4 decoration-white/30 hover:decoration-white" : ""}`}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>

            </motion.div>
        </footer>
    );
};
