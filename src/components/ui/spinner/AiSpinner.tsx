import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useState} from "react";
import Spinner from "./Spinner.tsx";

type Props = {
  isLoading: boolean;
};

const AiSpinner = ({isLoading}: Props) => {
  const messages = [
    "Analyzing data...",
    "Referencing sources...",
    "Referencing referees...",
    "Aiming...",
    "Kicking...",
    "Goal..."
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!isLoading) {
      setDisplayedText("");
      setCurrentMessageIndex(0);
      return;
    }

    const fullMessage = messages[currentMessageIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      setDisplayedText(fullMessage.slice(0, charIndex + 1));
      charIndex++;

      // When done typing one sentence
      if (charIndex === fullMessage.length) {
        clearInterval(typeInterval);

        // Wait before switching to next one
        setTimeout(() => {
          if (isLoading) {
            setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
            setDisplayedText("");
          }
        }, 800);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentMessageIndex, isLoading]);

  return (
      <AnimatePresence>
        {isLoading && (
            <motion.div
                key="loader"
                className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm bg-black/40"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.3}}
            >
              <motion.p
                  key={currentMessageIndex}
                  className="text-xl mb-2 font-semibold text-emerald-700 text-center"
                  initial={{opacity: 0, y: 5}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -5}}
                  transition={{duration: 0.3}}
              >
                {displayedText}
              </motion.p>
              <Spinner/>
            </motion.div>
        )}
      </AnimatePresence>
  );
};

export default AiSpinner;
