import SubjectButtons from "../components/ui/subject-buttons/SubjectButtons.tsx";
import Matches from "../components/features/matches/Matches.tsx";
import { useLoaderData } from "react-router-dom";
import { MatchesLoaderOutput } from "../routes/loaders/MatchesLoader.ts";
import { useState } from "react";

const MatchesPage = () => {
  const {data: matchesResponse} = useLoaderData<MatchesLoaderOutput>();
  const [selectedCompetition, setSelectedCompetition] = useState<string>(matchesResponse.competitions[0]);
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-300 text-center mb-4">
        Recent Matches
      </h2>
      <h3 className="text-lg sm:text-xl font-bold text-slate-300 text-center mb-4">
        Dont know what to say about last night's match?
        <br/>
        Pick a match and we'll help you out!
      </h3>
      <SubjectButtons
        subjects={ matchesResponse.competitions }
        selectedSubject={selectedCompetition}
        handleSubjectChange={setSelectedCompetition}
      />
      <Matches
        matches={ matchesResponse.fixtures }
        selectedCompetition={selectedCompetition}/>
    </div>
  )
}
export default MatchesPage;
