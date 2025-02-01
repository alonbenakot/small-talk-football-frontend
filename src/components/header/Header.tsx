import { FC } from "react";
import { NavLink } from "react-router-dom";
import AuthArea from "../../features/auth/auth-area/AuthArea.tsx";

const Header: FC = () => {
  return (
    <header>
      <nav className="flex items-center justify-between p-4 shadow-md bg-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-emerald-600">Small Talk Football</span>
          <ul className="flex gap-6 ml-4 text-slate-300">
            <li
              className="font-medium text-slate-300 border-b-2 border-emerald-600 hover:text-emerald-600 cursor-pointer">
              <NavLink to="">Articles</NavLink>
            </li>
            <li className="hover:text-emerald-600 cursor-pointer">Small Infos</li>
            <li className="hover:text-emerald-600 cursor-pointer">One-Liners</li>
            <li className="hover:text-emerald-600 cursor-pointer">About</li>
          </ul>
        </div>

        <AuthArea/>
        {/* Right Section - Actions */ }
        {/*<div className="flex items-center gap-4">*/ }
        {/*  <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">*/ }
        {/*    New Job*/ }
        {/*  </button>*/ }
        {/*  <img*/ }
        {/*    src="https://randomuser.me/api/portraits/men/1.jpg"*/ }
        {/*    alt="User"*/ }
        {/*    className="w-8 h-8 rounded-full border border-gray-300"*/ }
        {/*  />*/ }
        {/*</div>*/ }
      </nav>
    </header>
  )
}
export default Header;