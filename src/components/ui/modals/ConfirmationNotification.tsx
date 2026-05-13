import Notification from "./Notification.tsx";
import Button from "../button/Button.tsx";
import Spinner from "../spinner/Spinner.tsx";
import {AnimatePresence, motion} from "motion/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  text: string;
  isLoading?: boolean;
};

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const spinnerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const ConfirmationNotification = ({ isOpen, onClose, onConfirm, title, text, isLoading = false }: Props) => {
  return (
    <Notification
      isModalOpen={isOpen}
      onClose={onClose}
      title={title}
      text={text}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="spinner"
            variants={spinnerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <Spinner />
          </motion.div>
        ) : (
          <motion.div
            key="buttons"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, staggerChildren: 0.05 }}
            className="flex gap-2"
          >
            <Button
              buttonType="secondary"
              onClick={onClose}
            >
              No
            </Button>
            <Button
              buttonType="primary"
              onClick={onConfirm}
            >
              Yes
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Notification>
  );
};

export default ConfirmationNotification;
