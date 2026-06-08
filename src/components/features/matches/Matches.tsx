import {motion} from "motion/react";
import MatchCard from "./MatchCard.tsx";
import MatchModel from "./models/MatchModel.ts";
import {Link} from "react-router-dom";
import {DateUtils} from "../../../utils/DateUtils.ts";

type Props = {
  matches: MatchModel[];
  selectedCompetition: string;
  selectedDate: Date;
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Matches = ({ matches, selectedCompetition, selectedDate }: Props) => {
  const filteredMatches = matches
      ?.filter(
          (m) => m.competition.toLowerCase() === selectedCompetition.toLowerCase()
      )
      .filter((m) => DateUtils.isSameDay(new Date(m.matchDateTime), selectedDate))
      .map((m) => ({ ...m, matchDateTime: new Date(m.matchDateTime) }))
      .sort((a, b) => b.matchDateTime.getTime() - a.matchDateTime.getTime());

  return (
      <div className="flex justify-center">
        <motion.ul initial="hidden" animate="visible" variants={listVariants}>
          {filteredMatches?.map((match) => (
              <motion.li
                  key={match.id}
                  variants={itemVariants}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
              >
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Link to={`${match.id}`}>
                    <MatchCard match={match} />
                  </Link>
                </motion.div>
              </motion.li>
          ))}
        </motion.ul>
      </div>
  );
};

export default Matches;
