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

const titleVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const subtitleVariants = {
  hidden: { y: -10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, delay: 0.15 }
  }
};

const MatchesPage = () => {
  const { data: matchesResponse } = useLoaderData<MatchesLoaderOutput>();
  const [selectedCompetition, setSelectedCompetition] = useState<string>(
      matchesResponse.competitions[0]
  );
  const [filterMode, setFilterMode] = useState<string>("all");

  return (
      <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
      >
        <motion.h2
            className="text-2xl sm:text-3xl font-bold text-slate-300 text-center mb-4"
            variants={titleVariants}
        >
          Recent Matches
        </motion.h2>

        <motion.h3
            className="text-lg sm:text-xl font-bold text-slate-300 text-center mb-4"
            variants={subtitleVariants}
        >
          Dont know what to say about last night's match?
          <br />
          Pick a match and we'll help you out!
        </motion.h3>

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
