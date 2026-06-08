import React from "react";
import { motion } from "framer-motion";

import { staggerContainer } from "@/utils/motion";
// Define types for the HOC parameters
type ComponentType = React.ComponentType<unknown>;

const SectionWrapper = (Component: ComponentType, idName: string) =>
	function HOC() {
		return (
			<motion.section
				variants={staggerContainer(0.1)}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.25 }}
				className={`md:padding max-w-7xl mx-auto relative z-0`}
			>
				<span className="hash-span" id={idName}>
					&nbsp;
				</span>

				<Component />
			</motion.section>
		);
	};

export default SectionWrapper;
