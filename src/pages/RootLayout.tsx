import Header from "../components/ui/header/Header.tsx";
import Footer from "../components/ui/footer/Footer.tsx";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="grid h-screen grid-rows-[auto_5fr_auto]">
      <Header/>
      <main className="p-3 overflow-y-auto">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}
export default RootLayout;