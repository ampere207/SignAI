"use client"
import HeroBackground from "@/components/home/HeroBackground";
import { motion } from "framer-motion";
import { StarsCanvas } from "@/components/home";
import Link from "next/link";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import { fadeIn } from "@/utils/motion";

interface ServiceCardProps {
    index: number;
    title: string;
    description: string;
    icon: string;
    link: string;
}

function ServiceCard({ index, title, description, icon, link }: ServiceCardProps) {
    // Check if link is external (contains http or https)
    const isExternal = link.startsWith('http');

    return (
        <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
        >
            <Tilt className="w-full">
                <motion.div
                    variants={fadeIn("right", "spring", index * 0.5, 0.75)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    className={`w-full p-[2px] bg-gradient-to-br rounded-[20px] shadow-md`}
                >
                    <div className="bg-black/30 backdrop-filter backdrop-blur-lg rounded-[20px] py-8 px-6 min-h-[300px] flex flex-col justify-center items-center border border-white/10">
                        <div className="w-20 h-20 relative mb-4 rounded-full flex items-center justify-center">
                            <Image
                                src={icon}
                                alt={title}
                                width={50}
                                height={50}
                                className="object-contain"
                            />
                        </div>
                        <h3 className="text-white text-[22px] font-semibold text-center mb-3">
                            {title}
                        </h3>
                        <p className="text-gray-200 text-sm text-center">
                            {description}
                        </p>
                        <div className="mt-6 flex items-center text-white/70 text-sm font-medium">
                            {isExternal ? "Open External Link" : "Explore"}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isExternal ? "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" : "M9 5l7 7-7 7"} />
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </Tilt>
        </Link>
    );
}

function ELearningHome() {
    const features = [
        {
            title: "Guess the sign",
            description: "Test your sign language knowledge with fun and engaging quizzes",
            icon: "/assets/icons/frontend.svg",
            link: "/e-learning/guess",
        },
        // {
        //     title: "E-learning lessons",
        //     description: "Learn sign language through interactive lessons and practice exercises",
        //     icon: "/assets/icons/full-stack.svg",
        //     link: "https://3948-2401-4900-91eb-b44b-269e-3d4f-faa1-5dbb.ngrok-free.app",
        // },
        {
            title: "Test your skills",
            description: "Evaluate your sign language skills with our AI-powered quizzes",
            icon: "/assets/icons/full-stack.svg",
            link: "https://7d5b-2401-4900-91eb-b44b-d619-9d18-fea7-17f4.ngrok-free.app",
        },
        {
            title: "Gesture comparison",
            description: "Compare your sign language gestures with our AI model",
            icon: "/assets/icons/freelance.svg",
            link: "#",
        },
    ];

    return (
        <div className="relative w-full min-h-screen bg-[#6638B7] overflow-hidden">
            {/* Hero background for the gradient effect */}
            <HeroBackground />
            <StarsCanvas />

            {/* Content container */}
            <div className="relative z-10 pt-32 pb-16 px-4 flex flex-col items-center justify-center max-w-7xl mx-auto">
                {/* Header */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-6 text-center"
                >
                    SignAI Learning Center
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg text-gray-200 max-w-xl text-center mb-12"
                >
                    Explore our interactive tools and resources to learn and practice sign language
                </motion.p>

                {/* Feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-7xl">
                    {features.map((feature, index) => (
                        <ServiceCard
                            key={index}
                            index={index}
                            title={feature.title}
                            description={feature.description}
                            icon={feature.icon}
                            link={feature.link}
                        />
                    ))}
                </div>
            </div>

            {/* Optional decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a1a2e] to-transparent z-5"></div>
        </div>
    );
}

export default ELearningHome;