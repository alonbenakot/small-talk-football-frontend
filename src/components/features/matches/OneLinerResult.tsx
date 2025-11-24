import {Check, Copy} from "lucide-react";
import Button from "../../ui/button/Button.tsx";
import {useState} from "react";
import {motion} from "framer-motion";
import {Lang} from "../language/Lang.ts";
import {useLangStore} from "../../../store/store.ts";

type Props = {
  oneLinerText: string;
  handleStartOver: () => void;
}

const formatQuote = (text: string, lang: Lang) => {
  if (lang === Lang.HEBREW) {
    return `״${text}״`;
  }
  return `"${text}"`;
};

const OneLinerResult = ({oneLinerText, handleStartOver}: Props) => {
  const [copied, setCopied] = useState(false);
  const {selectedLang} = useLangStore();

  const handleCopy = async () => {
    if (!oneLinerText) return;
    await navigator.clipboard.writeText(oneLinerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-emerald-600">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
            <Check className="w-5 h-5 text-white"/>
          </div>
        </div>

        <motion.blockquote
            className={`text-zinc-800 text-xl sm:text-2xl font-medium text-center leading-relaxed mb-6 ${
                selectedLang === Lang.HEBREW ? 'font-normal' : 'italic'
            }`}
            dir={selectedLang === Lang.HEBREW ? 'rtl' : 'ltr'}
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.2}}
        >
          {formatQuote(oneLinerText, selectedLang)}
        </motion.blockquote>

        <motion.div
            className="flex flex-col sm:flex-row gap-3 mb-3"
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4, delay: 0.3}}
        >
          <motion.div
              className="flex-1"
              whileTap={{scale: 0.95}}
          >
            <Button
                buttonType='primary'
                type='button'
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2"
            >
              <motion.div
                  key={copied ? "check" : "copy"}
                  initial={{scale: 0.8, opacity: 0}}
                  animate={{scale: 1, opacity: 1}}
                  exit={{scale: 0.8, opacity: 0}}
                  transition={{duration: 0.2}}
                  className="flex items-center gap-2"
              >
                {copied ? (
                    <>
                      <Check className="w-4 h-4"/>
                      Copied!
                    </>
                ) : (
                    <>
                      <Copy className="w-4 h-4"/>
                      Copy
                    </>
                )}
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.4, delay: 0.4}}
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
        >
          <Button
              type="button"
              onClick={handleStartOver}
              buttonType="secondary"
              className="w-full text-sm py-2"
          >
            Start over
          </Button>
        </motion.div>
      </div>
  );
}

export default OneLinerResult;