import { NavLink } from "react-router-dom";
import AuthArea from "../../../features/auth/auth-area/AuthArea.tsx";
import LanguageDropDown from "../language-drop-down/LanguageDropDown.tsx";

const Header = () => {
  return (
    <header>
      <nav className="flex items-center justify-between p-4 shadow-md bg-zinc-800 h-16">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-emerald-600"> <NavLink to="">Small Talk Football</NavLink></span>
          <ul className="flex gap-6 ml-4 text-slate-300">
            <li
              className="font-medium border-b-2 border-emerald-600 hover:text-emerald-600 cursor-pointer">
              <NavLink to="">Home</NavLink>
            </li>
            <li
              className="border-emerald-600 hover:text-emerald-600 cursor-pointer">
              <NavLink to="">Articles</NavLink>
            </li>
            <li className="hover:text-emerald-600 cursor-pointer">Cheat Cards</li>
            <li className="hover:text-emerald-600 cursor-pointer">One-Liners</li>
            <li className="hover:text-emerald-600 cursor-pointer">About</li>
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <AuthArea/>
          <LanguageDropDown/>
        </div>
      </nav>
    </header>
  )
}
export default Header;