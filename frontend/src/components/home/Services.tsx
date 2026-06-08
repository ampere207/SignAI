"use client";
import { services } from "@/app/constants";
import ServiceCard from "./ServiceCard";
import { motion } from "framer-motion";

function Services() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-6 max-w-7xl mx-auto"
    >
      {services.map((service, index) => (
        <ServiceCard
          key={service.title}
          index={index}
          title={service.title}
          icon={service.icon}
        />
      ))}
    </motion.div>
  );
}

export default Services;
