import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils/motion";

function About() {
  return (
    <section
      className="md:my-36 md:w-2/3 w-full h-full xl:ml-36 lg:ml-12 p-8 md:mt-[40svh] xl:mt-[150px]"
      id="about"
    >
      <motion.div
        variants={textVariant()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <p className="sectionSubText text-blue-400">Welcome to SignAI</p>
        <h2 className="sectionHeadText text-white">Motion Intelligence.</h2>
      </motion.div>
      <motion.div
        variants={fadeIn("", "", 0.1, 1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mt-4 text-gray-300 text-[17px] w-full leading-[30px] flex flex-col justify-between gap-6"
      >
        <div className="backdrop-blur-sm bg-black/20 p-6 rounded-xl border border-blue-500/20 shadow-lg">
          <p className="mb-4">
            SignAI is a cutting-edge motion tracking platform that transforms how you interact with technology.
            Our advanced AI-powered system recognizes and interprets human gestures with remarkable precision,
            creating intuitive interfaces for applications across entertainment, healthcare, and industrial sectors.
          </p>

          <p>
            Built with state-of-the-art WebGL and Three.js technologies, SignAI provides real-time
            3D visualization and responsive controls that adapt to your unique movement patterns.
            Experience the future of human-computer interaction today!
          </p>
        </div>

        <div className="w-fit break-words">
          <Link
            href="/register"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary w-full transition-all duration-100 ease-in flex md:items-center gap-2 md:flex-row flex-wrap word-break hover:-translate-y-2"
          >
            <button className="bg-blue-600 py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-blue-700/50 hover:shadow-blue-500/70 hover:bg-blue-700 transition-all duration-300 ease-in flex items-center gap-2">
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="ml-1">
                <path fillRule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z" />
                <path fillRule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8 7.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export default About;
