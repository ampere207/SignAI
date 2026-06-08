"use client"
import HeroBackground from "@/components/home/HeroBackground";
import { motion } from "framer-motion";
import { StarsCanvas } from "@/components/home";
import Link from "next/link";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import { fadeIn } from "@/utils/motion";

interface TranslationCardProps {
    index: number;
    title: string;
    description: string;
    icon: string;
    link: string;
}

function TranslationCard({ index, title, description, icon, link }: TranslationCardProps) {
    return (
        <Link href={link}>
            <Tilt className="w-full">
                <motion.div
                    variants={fadeIn("right", "spring", index * 0.5, 0.75)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    className={`w-full p-[2px] bg-gradient-to-br  rounded-[20px] shadow-md`}
                >
                    <div className="bg-black/30 backdrop-filter backdrop-blur-lg rounded-[20px] py-8 px-6 min-h-[350px] flex flex-col justify-center items-center border border-white/10">
                        <div className="w-20 h-20 relative mb-6 rounded-full flex items-center justify-center bg-white/10">
                            <Image
                                src={icon}
                                alt={title}
                                width={64}
                                height={64}
                                className="object-contain"
                            />
                        </div>
                        <h3 className="text-white text-[26px] font-semibold text-center mb-4">
                            {title}
                        </h3>
                        <p className="text-gray-200 text-base text-center mb-6">
                            {description}
                        </p>

                    </div>
                </motion.div>
            </Tilt>
        </Link>
    );
}

function TranslatePage() {
    const translationOptions = [
        {
            title: "ISL to Text",
            description: "Convert Indian Sign Language gestures to text in real-time using our advanced AI recognition system",
            icon: "/assets/icons/frontend.svg", // Replace with appropriate icon
            link: "/isl-to-text",
        },
        {
            title: "Text/Audio to ISL",
            description: "Transform text or spoken audio into accurate Indian Sign Language demonstrations with our virtual avatar",
            icon: "/assets/icons/full-stack.svg", // Replace with appropriate icon
            link: "http://127.0.0.1:5000/",
        }
    ];

    return (
        <div className="relative w-full min-h-screen bg-[#6638B7] overflow-hidden">
            {/* Hero background for the gradient effect */}
            <HeroBackground />
            <StarsCanvas />

            {/* Content container */}
            <div className="relative z-10 pt-32 pb-16 px-4 flex flex-col items-center justify-center max-w-7xl mx-auto">
                {/* Header */}


                {/* Translation option cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    {translationOptions.map((option, index) => (
                        <TranslationCard
                            key={index}
                            index={index}
                            title={option.title}
                            description={option.description}
                            icon={option.icon}
                            link={option.link}
                        />
                    ))}
                </div>


            </div>

            {/* Optional decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a1a2e] to-transparent z-5"></div>
        </div>
    );
}

export default TranslatePage;