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
                className="w-full max-w-7xl mx-auto px-6 lg:px-20 py-16 lg:py-24 flex flex-col gap-24 lg:gap-32"
            >
                
                {/* Top Section */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-16">
                    {/* Services */}
                    <div className="flex flex-col gap-6 lg:w-1/3">
                        <motion.h4 variants={itemVariants} className="font-['Inter_Tight-SemiBold',Helvetica] font-semibold text-[#8c8c8c] text-sm lg:text-base tracking-[0.2em] uppercase mb-4">
                            SERVICES
                        </motion.h4>
                        <div className="flex flex-col gap-4">
                            {services.map((service, index) => (
                                <motion.a
                                    variants={itemVariants}
                                    key={index}
                                    href="#"
                                    className="font-['Inter_Tight-Regular',Helvetica] font-normal text-white/90 text-lg lg:text-xl hover:text-white hover:translate-x-2 transition-all duration-300 whitespace-nowrap w-fit"
                                >
                                    {service}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Contact & Socials */}
                    <div className="flex flex-col w-full md:w-2/3 lg:max-w-xl gap-8">
                        <motion.div variants={itemVariants} className="flex items-center pb-2">
                            <p className="font-['Roboto-Regular',Helvetica] font-normal text-white/70 text-lg lg:text-xl tracking-wide uppercase">
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
                                        className={`flex items-center gap-6 py-6 w-full group ${index === 0 ? "border-b border-[#9d9d9e]/30" : ""}`}
                                    >
                                        <IconComp className="w-8 h-8 text-white/70 group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300" />
                                        <span className="font-['Inter_Tight-Regular',Helvetica] font-light text-white text-3xl sm:text-4xl lg:text-5xl truncate group-hover:opacity-80 transition-opacity">
                                            {item.text}
                                        </span>
                                    </motion.a>
                                );
                            })}
                        </div>

                        <motion.a 
                            href="#"
                            variants={itemVariants} 
                            className="flex items-center justify-between w-full py-6 mt-4 border-t border-[#9d9d9e]/30 group cursor-pointer"
                        >
                            <span className="font-['Roboto-Regular',Helvetica] font-light text-white text-2xl group-hover:text-gray-300 transition-colors">
                                Social media
                            </span>
                            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                                <ArrowUpRight className="w-6 h-6 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                            </div>
                        </motion.a>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col items-center gap-12 lg:gap-20 pt-10">
                    <motion.div variants={itemVariants} className="flex items-center justify-center w-full">
                        <p className="font-['Inter_Tight-Medium',Helvetica] font-medium text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 text-6xl md:text-[100px] lg:text-[150px] leading-[0.9] tracking-tighter text-center lg:text-left drop-shadow-2xl">
                            We solve it<br className="lg:hidden" /> for you
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between w-full gap-6 px-4 pt-8 border-t border-white/10">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-white/60 text-sm font-['Roboto-Regular',Helvetica]">All systems operational</span>
                        </div>
                        <div className="flex flex-wrap justify-center sm:justify-end gap-6 sm:gap-10">
                            {footerLinks.map((link, index) => (
                                <a
                                    href="#"
                                    key={index}
                                    className={`font-['Inter_Tight-Regular',Helvetica] font-normal text-white/50 text-sm md:text-base hover:text-white transition-colors ${link.underline ? "underline underline-offset-4 decoration-white/30 hover:decoration-white" : ""}`}
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
