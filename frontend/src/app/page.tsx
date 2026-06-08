"use client";
import { useEffect, useState } from "react";
import {
  Hero,
  Navbar,
  StarsCanvas,
} from "@/components/home";
import Image from "next/image";
import Link from "next/link";

function App({ }: { loading: boolean }) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <main className="relative z-0 w-full h-full scroll-hidden bg-gradient-to-b from-[#1e0257] to-[#2a065e]">
      <div className="bg-cover bg-no-repeat bg-center relative overflow-hidden">
        <Navbar />
        <StarsCanvas />
        <Hero isMobile={isMobile} />
      </div>

      <button
        className="fixed hover:cursor-pointer md:w-20 md:h-20 h-8 w-8 p-2 bottom-8 md:right-10 right-8 text-center text-secondary bg-opacity-20 bg-tertiary rounded-lg
        hover:scale-110 hover:bg-opacity-40 hover:shadow-lg hover:shadow-tertiary/30
        active:scale-95 active:shadow-inner active:bg-opacity-60
        focus:outline-none focus:ring-2 focus:ring-tertiary/50
        transition-all duration-300"
      >
        <Link href={"/chatbot"} className="block w-full h-full">
          <Image
            src="/image.png"
            alt="up-arrow"
            width={20}
            height={20}
            className="w-full h-full object-contain transform transition-transform hover:rotate-12 active:rotate-45"
          />
        </Link>
      </button>
    </main>
  );
}

export default App;
