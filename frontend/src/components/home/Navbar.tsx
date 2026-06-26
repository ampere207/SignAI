"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import MenuIcon from "../../../public/assets/icons/menu.svg";
import CloseIcon from "../../../public/assets/icons/close.svg";
import { slideIn } from "@/utils/motion";
import { getApiBaseUrl } from "@/app/lib/api";

// Updated navigation links to match the image
const navLinks = [
  { id: "translate", title: "Translate", href: "/translate" },
  { id: "contribute", title: "Custom Trainer", href: "/contribute" },
];

function Navbar() {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (!token) {
      setCurrentUser(null);
      setIsLoadingUser(false);
      return;
    }

    const controller = new AbortController();

    const loadCurrentUser = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load user");
        }

        const data = await response.json();
        setCurrentUser(data.username ?? null);
      } catch {
        window.localStorage.removeItem("token");
        setCurrentUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadCurrentUser();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "token" && !event.newValue) {
        setCurrentUser(null);
        setIsLoadingUser(false);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      controller.abort();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    setCurrentUser(null);
    setIsLoadingUser(false);
  };

  const isExternalLink = (href: string) => href.startsWith("http");

  return (
    <>
      <nav
        className="w-full flex items-center py-5 fixed top-0 z-30 bg-[#181826] backdrop-filter backdrop-blur-sm"
      >
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto px-6">
          <Link href="/">
            <p className="text-white text-[22px] font-bold cursor-pointer">
              SignAI
            </p>
          </Link>

          {/* Desktop navigation */}
          <ul className="list-none hidden md:flex flex-row gap-8 items-center">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`text-white text-[16px] font-medium cursor-pointer ${active === nav.id ? "text-purple-300" : "hover:text-purple-300"
                  }`}
                onClick={() => setActive(nav.id)}
              >
                <Link
                  href={nav.href}
                  target={isExternalLink(nav.href) ? "_blank" : undefined}
                  rel={isExternalLink(nav.href) ? "noopener noreferrer" : undefined}
                >
                  {nav.title}
                </Link>
              </li>
            ))}
            {!isLoadingUser && currentUser ? (
              <li className="flex items-center gap-3 text-white text-sm">
                <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2">
                  Signed in as {currentUser}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-white/20 px-4 py-2 hover:border-white/40 hover:text-purple-300 transition-colors"
                >
                  Logout
                </button>
              </li>
            ) : null}
            {!isLoadingUser && !currentUser ? (
              <>
                <li className="text-white text-[16px] font-medium cursor-pointer hover:text-purple-300">
                  <Link href="/login">Login</Link>
                </li>
                <li className="text-white text-[16px] font-medium cursor-pointer hover:text-purple-300">
                  <Link href="/register">Register</Link>
                </li>
              </>
            ) : null}
          </ul>

          {/* Mobile menu button */}
          <div className="md:hidden flex flex-1 justify-end items-center">
            <div
              className="w-[28px] h-[28px] object-contain text-white flex justify-center items-center cursor-pointer"
              onClick={() => setToggle(!toggle)}
            >
              {toggle ? (
                <CloseIcon className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </div>

            {/* Mobile menu dropdown */}
            <motion.div
              variants={slideIn("right", "tween", 0, 0.3)}
              initial="hidden"
              animate={toggle ? "show" : "hidden"}
              className={`${!toggle ? "hidden" : "flex"
                } p-6 bg-[#2A1963] absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
            >
              <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
                {navLinks.map((nav) => (
                  <li
                    key={nav.id}
                    className={`font-medium cursor-pointer text-[16px] ${active === nav.id ? "text-purple-300" : "text-white"
                      }`}
                    onClick={() => {
                      setToggle(!toggle);
                      setActive(nav.id);
                    }}
                  >
                    <Link
                      href={nav.href}
                      target={isExternalLink(nav.href) ? "_blank" : undefined}
                      rel={isExternalLink(nav.href) ? "noopener noreferrer" : undefined}
                    >
                      {nav.title}
                    </Link>
                  </li>
                ))}
                {!isLoadingUser && currentUser ? (
                  <li className="flex flex-col gap-2 text-white">
                    <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm">
                      Signed in as {currentUser}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setToggle(false);
                      }}
                      className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/40 hover:text-purple-300 transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                ) : null}
                {!isLoadingUser && !currentUser ? (
                  <>
                    <li className="text-white text-[16px] font-medium cursor-pointer">
                      <Link href="/login">Login</Link>
                    </li>
                    <li className="text-white text-[16px] font-medium cursor-pointer">
                      <Link href="/register">Register</Link>
                    </li>
                  </>
                ) : null}
              </ul>
            </motion.div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
