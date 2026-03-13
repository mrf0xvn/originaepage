import { motion, Variants } from "framer-motion";
import { ArrowRight } from "./ArrowRight";
import theoRameImg from "./Theo Rame.png";
import tracyImg from "./Tracy.png";
import teamMemberImg from "./Team member.png";

const teamMembers = [
    {
        name: "Theo Rame",
        gradient: "from-transparent to-[#F2F2F2]",
        linkedinUrl: "#",
        image: theoRameImg,
    },
    {
        name: "Tracy",
        gradient: "from-transparent to-[#F2F2F2]",
        linkedinUrl: "#",
        image: tracyImg,
    },
    {
        name: "Our team",
        gradient: "from-transparent to-[#F2F2F2]",
        linkedinUrl: "#",
        span: true,
        image: teamMemberImg,
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.2, duration: 0.5 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
};

export const TeamSection = (): JSX.Element => {
    return (
        <section className="w-full bg-white flex flex-col items-center overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-20 py-16 lg:py-20 flex flex-col gap-10 lg:gap-16">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#A1A1AA]"
                >
                    <div className="flex flex-col gap-4 lg:gap-6 max-w-lg">
                        <p className="font-['Inter_Tight-SemiBold',Helvetica] font-semibold text-black text-xl lg:text-2xl tracking-[0] uppercase">
                            OUR TEAM:
                        </p>
                        <h2 className="font-['Inter_Tight-Regular',Helvetica] font-normal text-black text-4xl lg:text-6xl leading-tight">
                            Meet Us
                        </h2>
                    </div>

                    <button className="btn-primary btn-dark group w-fit shrink-0 border-none">
                        <span className="btn-text font-['Inter_Tight-Medium',Helvetica] font-medium text-base md:text-lg whitespace-nowrap">
                            Book a meeting
                        </span>
                        <div className="btn-arrow-circle">
                            <ArrowRight className="btn-arrow-icon w-5 h-5 arrow-pulse" color="currentColor" />
                        </div>
                    </button>
                </motion.div>

                {/* Team Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]"
                >
                    {teamMembers.map((member) => (
                        <motion.div
                            key={member.name}
                            variants={itemVariants}
                            className={`relative flex flex-col justify-end p-6 rounded-3xl overflow-hidden bg-[#F2F2F2] h-[350px] md:h-[450px] shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer ${member.span ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'}`}
                        >
                            {member.image && (
                                <img 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-90"></div>
                            
                            <div className="relative z-10 flex items-end justify-between w-full mt-auto transform transition-transform duration-500 group-hover:-translate-y-2">
                                <h3 className="font-['Inter_Tight-Medium',Helvetica] font-medium text-white text-2xl lg:text-3xl drop-shadow-md">
                                    {member.name}
                                </h3>

                                <a
                                    href={member.linkedinUrl}
                                    className="inline-flex items-center justify-center px-4 py-2 lg:px-5 lg:py-2.5 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-md shadow-black/20"
                                >
                                    <span className="font-['Inter_Tight-Medium',Helvetica] font-medium text-black text-sm lg:text-base whitespace-nowrap">
                                        LinkedIn →
                                    </span>
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};
