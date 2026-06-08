import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { fadeIn, textVariant } from "@/utils/motion";
import { styles } from "../../utils/styles";
import PlayerCanvas from "../../../public/canvas/Player";
import Link from "next/link";

interface HeroProps {
  isMobile: boolean;
}

function Hero({ isMobile }: HeroProps) {
  return (
    <section className="relative w-full h-[100svh] md:max-h-[800px] max-h-[600px] mx-auto flex flex-col">
      {/* Hero content with side-by-side layout */}
      <div className={`${styles.paddingX} mt-4 absolute inset-0 top-[120px] max-w-7xl mx-auto flex md:flex-row flex-col items-start gap-5`}>

        {/* Left side: Text content */}
        <div className="md:w-1/2 w-full flex flex-row items-start gap-5">
          <motion.div
            variants={textVariant()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <h1 className={`${styles.heroHeadText} text-white`}>
              Breaking Barriers with <span className="text-[#a167ff] text-shadow-4xl">SignAI</span>
            </h1>
            <p className={`${styles.heroSubText} mt-2 text-white-100`}>
              Empowering{" "}
              <TypeAnimation
                sequence={[
                  "communication",
                  2000,
                  "accessibility",
                  2000,
                  "sign language",
                  2000,
                  "inclusive design",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                className="text-blue-400"
                repeat={Infinity}
              />
            </p>

            <motion.div
              variants={fadeIn("", "", 0.3, 1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link href="/e-learning" className="btn">
                <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-xl outline-none w-fit font-bold shadow-md shadow-purple-700/50 hover:shadow-purple-500/70 transition-all duration-300 ease-in flex items-center gap-2">
                  Start Learning
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="ml-1">
                    <path fillRule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z" />
                    <path fillRule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8 7.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
              </Link>

              <Link href="/translate">
                <button className="border-2 border-purple-500/50 hover:border-purple-500 text-white py-3 px-8 rounded-xl outline-none w-fit font-bold hover:bg-purple-500/10 transition-all duration-300 ease-in">
                  Try Translator
                </button>
              </Link>
            </motion.div>

            <motion.p
              variants={fadeIn("", "", 0.6, 1)}
              className="mt-8 max-w-md text-gray-300 text-sm sm:text-base backdrop-blur-sm bg-black/20 p-4 rounded-xl border border-purple-500/20 shadow-lg"
            >
              SignAI bridges communication gaps with AI-powered sign language recognition. Learn, translate, and interact in real-time with our intuitive platform designed for accessibility and inclusion.
            </motion.p>
          </motion.div>
        </div>

        {/* Right side: Avatar / Canvas remains the same */}
        <motion.div
          variants={fadeIn("left", "tween", 0.4, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="md:w-1/2 w-full h-[600px] md:h-[600px] mt-4 md:mt-0 relative"
        >
          {/* Avatar Canvas - larger and cropped to show only part of the model */}
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-[15%] w-[250%] h-[150%] overflow-hidden md:block hidden z-20">
            <div className="absolute inset-0 scale-125">
              <PlayerCanvas isMobile={isMobile} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
