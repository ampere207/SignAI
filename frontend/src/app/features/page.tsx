"use client"
import Services from "@/components/home/Services";
import HeroBackground from "@/components/home/HeroBackground";
import { motion } from "framer-motion";
import { StarsCanvas } from "@/components/home";

function Features() {
    return (
        <div className="relative w-full min-h-screen bg-[#6638B7] overflow-hidden">
            {/* Hero background for the gradient effect */}
            <HeroBackground />
            <StarsCanvas />

            {/* Content container */}
            <div className="relative z-10 pt-32 pb-16 px-4 flex flex-col items-center justify-center max-w-7xl mx-auto">
                {/* Header */}
                {/* <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-6 text-center"
                >
                    Our Features
                </motion.h1> */}

                <motion.p
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg text-gray-200 max-w-xl text-center mb-12"
                >
                    Advanced gesture recognition capabilities powered by AI for seamless human-computer interaction
                </motion.p>

                {/* Features cards section */}
                <div className="w-full">
                    <Services />
                </div>
            </div>

            {/* Optional decorative elements to match the image design */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a1a2e] to-transparent z-5"></div>
        </div>
    );
}

export default Features;