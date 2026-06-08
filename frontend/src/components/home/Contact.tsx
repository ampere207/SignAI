import { motion } from "framer-motion";
import { slideIn } from "@/utils/motion";

function Contact() {
  return (
    <motion.div
      variants={slideIn("left", "tween", 0.2, 1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="xl:my-36 md:w-2/5 w-full bg-bgSecondaryDark xl:ml-36 lg:ml-16 md:ml-10 p-8 rounded-2xl shadow-primary"
      id="contact"
    >

    </motion.div>
  );
}

export default Contact;
