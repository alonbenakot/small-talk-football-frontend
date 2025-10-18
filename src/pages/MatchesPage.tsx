import CompetitionButtons from "../components/features/matches/CompetitionButtons.tsx";
import Matches from "../components/features/matches/Matches.tsx";
import { useLoaderData } from "react-router-dom";
import { MatchesLoaderOutput } from "../routes/loaders/MatchesLoader.ts";

const MatchesPage = () => {
  const {data: matchesResponse} = useLoaderData<MatchesLoaderOutput>();
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-300 text-center mb-4">
        Recent Matches
      </h2>
      <CompetitionButtons competitions={ matchesResponse.competitions }/>
      <Matches matches={ matchesResponse.fixtures }/>
    </div>
  )
}
export default MatchesPage;
