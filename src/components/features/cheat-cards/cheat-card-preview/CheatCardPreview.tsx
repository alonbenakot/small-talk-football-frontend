import { motion } from "framer-motion";
import { subStringUntilColon } from "../../../../utils/FormatUtil.ts";
import CheatCardModel from "../models/CheatCardModel.ts";

interface CheatCardPreviewProps {
  card: CheatCardModel;
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
}

const CheatCardPreview = ({card, index, isSelected, onSelect}: CheatCardPreviewProps) => {
  return (
    <motion.div
      className={ `p-4 rounded-xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'bg-emerald-100 border-2 border-emerald-600 shadow-md'
          : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300'
      }` }
      onClick={ () => onSelect(index) }
      whileHover={ {scale: 1.02} }
      whileTap={ {scale: 0.98} }
      layout
    >
      <h4 className="font-semibold text-slate-800 mb-1">
        { subStringUntilColon(card.title) }
      </h4>
      <p className="text-sm text-slate-600">{ card.subtitle }</p>
    </motion.div>
  );
};

export default CheatCardPreview;