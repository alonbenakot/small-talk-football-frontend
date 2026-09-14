import SubjectButtons from "../components/ui/subject-buttons/SubjectButtons.tsx";
import TeamList from "../components/features/teams/TeamList.tsx";
import MessageBlock from "../components/ui/message-block/MessageBlock.tsx";
import {useLoaderData} from "react-router-dom";
import {TeamsLoaderOutput} from "../routes/loaders/TeamsLoader.ts";
import {useState} from "react";
import {motion} from "motion/react";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const TeamsPage = () => {
  const { data: teamsResponse } = useLoaderData<TeamsLoaderOutput>();
  const [selectedCompetition, setSelectedCompetition] = useState<string>(
      teamsResponse.competitions[0]
  );

  return (
      <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
      >
        <motion.div
            className="text-center mb-8"
            initial={{y: -20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{duration: 0.6}}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-300 mb-2">
            Teams
          </h1>
          <p className="text-slate-400 text-lg">
            Pick a club and find out what there is to say about it
          </p>
        </motion.div>

        {teamsResponse.competitions.length === 0
            ? <MessageBlock title="No teams yet" message="Standings have not been loaded. Check back soon."/>
            : <>
              <SubjectButtons
                  subjects={teamsResponse.competitions}
                  selectedSubject={selectedCompetition}
                  handleSubjectChange={setSelectedCompetition}
              />

              <TeamList
                  teams={teamsResponse.teams}
                  selectedCompetition={selectedCompetition}
              />
            </>
        }
      </motion.div>
  );
};

export default TeamsPage;
