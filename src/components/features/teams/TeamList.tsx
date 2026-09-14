import {motion} from "motion/react";
import {TeamSummary} from "./models/TeamsResponse.ts";
import TeamRow from "./TeamRow.tsx";

const CHAMPIONS_LEAGUE = "CHAMPIONS_LEAGUE";

type Props = {
  teams: TeamSummary[];
  selectedCompetition: string;
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const teamLink = (team: TeamSummary) =>
    team.competition === CHAMPIONS_LEAGUE
        ? `/teams/${team.id}?competition=${CHAMPIONS_LEAGUE}`
        : `/teams/${team.id}`;

const TeamList = ({ teams, selectedCompetition }: Props) => {
  const filteredTeams = teams.filter((t) => t.competition === selectedCompetition);

  return (
      <div className="flex justify-center">
        <motion.ul
            key={selectedCompetition}
            className="w-full max-w-md sm:max-w-lg md:max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={listVariants}
        >
          {filteredTeams.map((team) => (
              <motion.li
                  key={team.id}
                  variants={itemVariants}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
              >
                <motion.div whileHover={{ scale: 1.02 }}>
                  <TeamRow team={team} to={teamLink(team)} />
                </motion.div>
              </motion.li>
          ))}
        </motion.ul>
      </div>
  );
};

export default TeamList;
