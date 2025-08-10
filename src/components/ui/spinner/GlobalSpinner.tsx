import { AnimatePresence, motion } from "framer-motion";
import Spinner from "./Spinner.tsx";

type Props = {
  isNavigating: boolean;
};

const GlobalSpinner = ({ isNavigating }: Props) => {
  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs blur-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Spinner />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSpinner;
