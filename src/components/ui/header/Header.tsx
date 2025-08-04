import { useState } from "react";
import { NavLink } from "react-router-dom";
import AuthArea from "../../features/auth/auth-area/AuthArea.tsx";
import LanguageDropDown from "../language-drop-down/LanguageDropDown.tsx";
import { useAuthStore } from "../../../store/store.ts";
import { NotepadText, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const getLinkStyle = ({ isActive }: { isActive: boolean }) => {
  const activeStyle = "font-medium border-b-2 border-emerald-600";
  return isActive ? activeStyle : "";
};

const menuVariants = {
  hidden: {
    opacity: 0,
    maxHeight: 0,
    scaleY: 0,
    transition: {
      opacity: { duration: 0.2 },
      maxHeight: { duration: 0.3, ease: "easeInOut" },
      scaleY: { duration: 0.3, ease: "easeInOut" },
    },
  },
  visible: {
    opacity: 1,
    maxHeight: 500, // large enough to contain menu
    scaleY: 1,
    transition: {
      opacity: { duration: 0.3 },
      maxHeight: { duration: 0.4, ease: "easeInOut" },
      scaleY: { duration: 0.4, ease: "easeInOut" },
      when: "beforeChildren",
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const Header = () => {
  const { selectedUser } = useAuthStore();
  const isPendingArticle = selectedUser?.userIndications?.pendingArticles;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-zinc-800 shadow-md">
      <nav className="flex items-center justify-between p-4 h-16 sm:h-auto relative">
        {/* Logo + Hamburger */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <span className="text-xl font-bold text-emerald-600">
            <NavLink to="/">Small Talk Football</NavLink>
          </span>

          {/* Hamburger button - only on mobile */}
          <button
            className="sm:hidden text-slate-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X size={24} className="transform transition-transform duration-300" />
            ) : (
              <Menu size={24} className="transform transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden sm:flex flex-row gap-6 text-slate-300 sm:items-center">
          <li className="hover:text-emerald-600">
            <NavLink to="/" className={getLinkStyle}>
              Home
            </NavLink>
          </li>
          <li className="hover:text-emerald-600">
            <NavLink to="/articles">
              {({ isActive }) => (
                <span className={`flex items-center ${getLinkStyle({ isActive })}`}>
                  Articles
                  {isPendingArticle && (
                    <NotepadText className="w-4 h-4 ml-1 text-emerald-500" />
                  )}
                </span>
              )}
            </NavLink>
          </li>
          <li className="hover:text-emerald-600">
            <NavLink to="/cheat-cards" className={getLinkStyle}>
              Cheat Cards
            </NavLink>
          </li>
          <li className="hover:text-emerald-600">
            <NavLink to="/one-liners" className={getLinkStyle}>
              One-Liners
            </NavLink>
          </li>
          <li className="hover:text-emerald-600">
            <NavLink to="/about" className={getLinkStyle}>
              About
            </NavLink>
          </li>
        </ul>

        {/* Desktop Auth + Language */}
        <div className="hidden sm:flex items-center gap-4 ml-4">
          <AuthArea />
          <LanguageDropDown />
        </div>
      </nav>

      {/* Mobile Nav + Auth + Language with animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            style={{ originY: 0, overflow: "hidden" }}
            className="sm:hidden bg-zinc-800 px-4"
          >
            <motion.ul
              variants={menuVariants}
              className="flex flex-col gap-4 py-4 text-slate-300"
            >
              <motion.li
                variants={itemVariants}
                className="hover:text-emerald-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <NavLink to="/" className={getLinkStyle}>
                  Home
                </NavLink>
              </motion.li>
              <motion.li
                variants={itemVariants}
                className="hover:text-emerald-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <NavLink to="/articles">
                  {({ isActive }) => (
                    <span className={`flex items-center ${getLinkStyle({ isActive })}`}>
                      Articles
                      {isPendingArticle && (
                        <NotepadText className="w-4 h-4 ml-1 text-emerald-500" />
                      )}
                    </span>
                  )}
                </NavLink>
              </motion.li>
              <motion.li
                variants={itemVariants}
                className="hover:text-emerald-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <NavLink to="/cheat-cards" className={getLinkStyle}>
                  Cheat Cards
                </NavLink>
              </motion.li>
              <motion.li
                variants={itemVariants}
                className="hover:text-emerald-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <NavLink to="/one-liners" className={getLinkStyle}>
                  One-Liners
                </NavLink>
              </motion.li>
              <motion.li
                variants={itemVariants}
                className="hover:text-emerald-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <NavLink to="/about" className={getLinkStyle}>
                  About
                </NavLink>
              </motion.li>
            </motion.ul>

            {/* Auth + Language */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 pb-4 border-t border-zinc-700"
            >
              <AuthArea />
              <LanguageDropDown />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
