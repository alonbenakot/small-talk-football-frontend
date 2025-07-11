import { AnimatePresence, motion } from "framer-motion";
import Spinner from "./Spinner.tsx";

type Props = {
  isNavigating: boolean;
}

const GlobalSpinner = ({isNavigating}: Props) => {
  return (
    <AnimatePresence>
    { isNavigating && (
      <motion.div
        key="loader"
        className="absolute inset-0 z-50 flex justify-center bg-opacity-60"
        initial={ {opacity: 0} }
        animate={ {opacity: 1} }
        exit={ {opacity: 0} }
        transition={ {duration: 0.3} }
      >
        <div className="mt-24">
          <Spinner/>
        </div>
      </motion.div>
    ) }
  </AnimatePresence>)
}

export default GlobalSpinner;