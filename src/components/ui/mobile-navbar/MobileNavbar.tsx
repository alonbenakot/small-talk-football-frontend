import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  FileText,
  StickyNote,
  MessageSquareQuote,
  Info
} from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
  { to: "/articles", label: "Articles", icon: <FileText className="w-5 h-5" /> },
  { to: "/cheat-cards", label: "Cheat Cards", icon: <StickyNote className="w-5 h-5" /> },
  { to: "/one-liners", label: "One-Liners", icon: <MessageSquareQuote className="w-5 h-5" /> },
  { to: "/about", label: "About", icon: <Info className="w-5 h-5" /> },
];

const getLinkStyle = ({ isActive }: { isActive: boolean }) =>
  isActive ? "text-emerald-600" : "text-slate-300";

const MobileNavbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsVisible(currentY <= lastScrollY); // not visible when scrolling down
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 80 }} // slide down when hiding
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-800 border-t border-zinc-700 md:hidden"
    >
      <ul className="flex justify-around items-center py-2">
        {links.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs ${getLinkStyle({ isActive })}`
              }
            >
              {icon}
              <span className="mt-1">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default MobileNavbar;
