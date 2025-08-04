import Header from "../components/ui/header/Header.tsx";
import { Outlet, useNavigation } from "react-router-dom";
import GlobalSpinner from "../components/ui/spinner/GlobalSpinner.tsx";

const RootLayout = () => {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-[url('/grass-background.png')] bg-bottom bg-cover"></div>

      <div className="grid min-h-screen grid-rows-[auto_1fr] sm:grid-rows-[auto_5fr]">
        <Header />

        <main className="p-4 sm:p-6 md:p-8 overflow-y-auto relative">
          <GlobalSpinner isNavigating={isNavigating} />
          <Outlet />
        </main>

        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default RootLayout;
