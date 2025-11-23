import { motion } from "framer-motion";
import { formatString } from "../../../utils/FormatUtil.ts";

type Props = {
  subjects: string[];
  handleSubjectChange: (subject: string) => void;
  selectedSubject: string;
}
const SubjectButtons = ({subjects, selectedSubject, handleSubjectChange}: Props) => {
  return (
    <motion.div
      className="mb-8"
      initial={ {y: 20, opacity: 0} }
      animate={ {y: 0, opacity: 1} }
      transition={ {duration: 0.6, delay: 0.2} }
    >
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
      { subjects?.map((subject: string) => (
        <motion.button
          key={ subject }
          onClick={ () => handleSubjectChange(subject) }
          className={ `px-4 sm:px-5 py-2 sm:py-3 rounded-full font-semibold ${
            selectedSubject === subject
              ? 'bg-emerald-600 text-white shadow-lg scale-105'
              : 'bg-white text-slate-600 hover:bg-slate-100 shadow-md hover:shadow-lg'
          }` }
          whileHover={ {scale: 1.05} }
          whileTap={ {scale: 0.95} }
          initial={ {opacity: 0, y: 10} }
          animate={ {opacity: 1, y: 0} }
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          { formatString(subject) }
        </motion.button>
      )) }
    </div>
    </motion.div>
  )
}
export default SubjectButtons;