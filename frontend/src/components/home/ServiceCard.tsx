import Tilt from "react-parallax-tilt";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";

interface ServiceCardProps {
  index: number;
  title: string;
  icon: string;
}

function ServiceCard({ index, title, icon }: ServiceCardProps) {
  return (
    <Tilt className="w-[280px]">
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="w-full p-[2px] bg-bgSecondaryLight rounded-[20px] shadow-md"
      >
        <div className="bg-[#0B0F18] rounded-[20px] py-8 px-6 min-h-[300px] flex flex-col justify-center items-center">
          <div className="w-16 h-16 relative mb-4">
            <Image
              src={icon}
              alt={title}
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <h3 className="text-white text-[22px] font-semibold text-center">
            {title}
          </h3>
        </div>
      </motion.div>
    </Tilt>
  );
}

export default ServiceCard;
