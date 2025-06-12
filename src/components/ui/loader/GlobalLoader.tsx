import { AnimatePresence, motion } from "framer-motion";
import Loader from "./Loader.tsx";

type Props = {
  isNavigating: boolean;
}

const GlobalLoader = ({isNavigating}: Props) => {
  return (
    <AnimatePresence>
    { isNavigating && (
      <motion.div
        key="loader"
        className="absolute inset-0 z-50 flex justify-center bg-gray-200 bg-opacity-60"
        initial={ {opacity: 0} }
        animate={ {opacity: 1} }
        exit={ {opacity: 0} }
        transition={ {duration: 0.3} }
      >
        <div className="mt-24">
          <Loader/>
        </div>
      </motion.div>
    ) }
  </AnimatePresence>)
}

export default GlobalLoader;