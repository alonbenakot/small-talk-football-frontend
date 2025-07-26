import { NavLink } from "react-router-dom";
import AuthArea from "../../features/auth/auth-area/AuthArea.tsx";
import LanguageDropDown from "../language-drop-down/LanguageDropDown.tsx";
import { useAuthStore } from "../../../store/store.ts";
import { NotepadText } from "lucide-react";


const getLinkStyle = ({isActive}: { isActive: boolean }) => {
  const activeStyle = "font-medium border-b-2 border-emerald-600";
  return isActive ? activeStyle : "";
}

const Header = () => {
  const {selectedUser} = useAuthStore();
  const isPendingArticle = selectedUser?.userIndications?.pendingArticles;

  return (
    <header>
      <nav className="flex items-center justify-between p-4 shadow-md bg-zinc-800 h-16">
        <div className="flex items-center gap-4">

          <span className="text-2xl font-bold text-emerald-600">
            <NavLink to="/">Small Talk Football</NavLink>
          </span>

          <ul className="flex gap-6 ml-4 text-slate-300">
            <li
              className="hover:text-emerald-600 cursor-pointer">
              <NavLink to="/" className={ getLinkStyle }>
                Home
              </NavLink>
            </li>
            <li className="hover:text-emerald-600 cursor-pointer">
              <NavLink to="/articles">
                { ({isActive}) => (
                  <span className={ `flex items-center ${ getLinkStyle({isActive}) }` }>
                    Articles
                    { isPendingArticle && (
                      <NotepadText className="w-4 h-4 ml-1 text-emerald-500"/>
                    ) }
                  </span>
                ) }
              </NavLink>
            </li>
            <li className="hover:text-emerald-600 cursor-pointer">
              <NavLink to="/cheat-cards" className={ getLinkStyle }>
                Cheat Cards
              </NavLink>
            </li>
            <li className="hover:text-emerald-600 cursor-pointer">
              <NavLink to="/one-liners" className={ getLinkStyle }>
                One-Liners
              </NavLink>
            </li>
            <li className="hover:text-emerald-600 cursor-pointer">
              <NavLink to="/about" className={ getLinkStyle }>
                About
              </NavLink>
            </li>
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