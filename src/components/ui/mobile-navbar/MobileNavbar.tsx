import {NavLink} from "react-router-dom";
import {FileText, Home, Info, StickyNote, Trophy} from "lucide-react";

const links = [
  { to: "/home", label: "Home", icon: <Home className="w-5 h-5" /> },
  { to: "/articles", label: "Articles", icon: <FileText className="w-5 h-5" /> },
  { to: "/matches", label: "Matches", icon: <Trophy className="w-5 h-5" /> },
  { to: "/cheat-cards", label: "Cheat Cards", icon: <StickyNote className="w-5 h-5" /> },
  { to: "/about", label: "About", icon: <Info className="w-5 h-5" /> },
];

const getLinkStyle = ({ isActive }: { isActive: boolean }) =>
  isActive ? "text-emerald-600" : "text-slate-300";

const MobileNavbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-800 border-t border-zinc-700 md:hidden">
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
    </nav>
  );
};

export default MobileNavbar;
