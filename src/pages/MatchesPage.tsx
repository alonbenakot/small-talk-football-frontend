import SubjectButtons from "../components/ui/subject-buttons/SubjectButtons.tsx";
import Matches from "../components/features/matches/Matches.tsx";
import {useLoaderData} from "react-router-dom";
import {MatchesLoaderOutput} from "../routes/loaders/MatchesLoader.ts";
import {useState} from "react";
import {motion} from "motion/react";
import TogglePill from "../components/ui/toggle-pill/TogglePill.tsx";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const MatchesPage = () => {
  const { data: matchesResponse } = useLoaderData<MatchesLoaderOutput>();
  const [selectedCompetition, setSelectedCompetition] = useState<string>(
      matchesResponse.competitions[0]
  );
  const [filterMode, setFilterMode] = useState<string>("finished");

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
            Recent Matches
          </h1>
          <p className="text-slate-400 text-lg">
            Get AI-powered conversation starters for any match
          </p>
        </motion.div>

        <SubjectButtons
            subjects={matchesResponse.competitions}
            selectedSubject={selectedCompetition}
            handleSubjectChange={setSelectedCompetition}
        />

        <TogglePill
            options={["All", "Finished"]}
            selectedValue={filterMode}
            onChange={setFilterMode}
        />

        <Matches
            key={selectedCompetition}
            matches={matchesResponse.fixtures}
            selectedCompetition={selectedCompetition}
            showFinishedOnly={filterMode === "finished"}
        />
      </motion.div>
  );
};

export default MatchesPage;
