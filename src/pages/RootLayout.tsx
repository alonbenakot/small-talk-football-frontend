import Header from "../components/header/Header.tsx";
import Footer from "../components/footer/Footer.tsx";
import { Outlet } from "react-router-dom";
import { FC } from "react";

const RootLayout: FC = () => {
  return (
    <div className="grid h-screen grid-rows-[auto_4fr_auto]">
      <Header/>
      <main className="p-3 overflow-auto">
        <Outlet />
      </main>
      <Footer/>
    </div>
  )
}
export default RootLayout;