import CheatCardModel from "../models/CheatCardModel.ts";
import { useLangStore } from "../../../../store/store.ts";
import Button from "../../../ui/button/Button.tsx";
import { motion } from "motion/react";

type Props = CheatCardModel & {
  onNext: () => void,
  onPrev: () => void,
  isFirst: boolean,
  isLast: boolean
};

const CheatCard = ({title, subtitle, infoTexts, onNext, onPrev, isFirst, isLast}: Props) => {
  const {selectedLang} = useLangStore();
  return (
    <motion.article
      className="shadow-sm rounded-xl border border-gray-200 max-w-3xl"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 400, damping: 30 }}
    >
      <h2 className="block w-full text-xl font-bold bg-zinc-800 text-emerald-600 px-4 py-2 rounded-t-xl shadow-sm">
        { title }
      </h2>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          { subtitle }
        </h3>
        <p className="text-md text-gray-700">
          { infoTexts.find(text => text.lang === selectedLang.toUpperCase())?.text }
        </p>
      </div>
      <div className="flex justify-between p-3">
        <Button buttonType="primary" onClick={onPrev} disabled={isFirst}>Previous</Button>
        <Button buttonType="primary" onClick={onNext} disabled={isLast}>Next</Button>
      </div>
    </motion.article>
  )
}

export default CheatCard;