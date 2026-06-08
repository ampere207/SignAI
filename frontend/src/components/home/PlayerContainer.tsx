import { motion } from "framer-motion";
import { slideIn } from "@/utils/motion";
import { PlayerCanvas } from "../../../public/canvas";
import React from "react";

interface PlayerContainerProps {
  isMobile: boolean;
}

function PlayerContainer({ isMobile }: PlayerContainerProps) {
  return (
    <motion.div
      variants={slideIn("right", "tween", 0.2, 1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="md:w-1/3 w-full md:h-auto h-[440px] cursor-pointer"
    >
      <PlayerCanvas isMobile={isMobile} />
    </motion.div>
  );
}

export default PlayerContainer;
