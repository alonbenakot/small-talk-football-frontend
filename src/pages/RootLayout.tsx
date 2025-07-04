import Header from "../components/ui/header/Header.tsx";
import { Outlet, useNavigation } from "react-router-dom";
import GlobalLoader from "../components/ui/loader/GlobalLoader.tsx";

const RootLayout = () => {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-[url('/grass-background.png')] bg-[center_top_85%] bg-cover"></div>
      <div className="grid h-full grid-rows-[auto_5fr]">
        <Header/>
        <main className="p-3 overflow-y-auto relative">
          <GlobalLoader isNavigating={ isNavigating }/>
          <Outlet/>
        </main>
        {/* <Footer/> */ }
      </div>
    </div>
  );
};

export default RootLayout;
