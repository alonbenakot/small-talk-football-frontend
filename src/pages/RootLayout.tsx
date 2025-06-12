import Header from "../components/ui/header/Header.tsx";
import Footer from "../components/ui/footer/Footer.tsx";
import { Outlet, useNavigation } from "react-router-dom";
import GlobalLoader from "../components/ui/loader/GlobalLoader.tsx";

const RootLayout = () => {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <div className="grid h-screen grid-rows-[auto_5fr_auto]">
      <Header/>
      <main className="p-3 overflow-y-auto relative">
        <GlobalLoader isNavigating={isNavigating}/>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  );
};

export default RootLayout;
