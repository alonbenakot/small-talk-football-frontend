import MatchCard from "./MatchCard.tsx";
import MatchModel from "./models/MatchModel.ts";
import { Link } from "react-router-dom";

type Props = {
  matches: MatchModel[];
  selectedCompetition: string;
}
const Matches = ({matches, selectedCompetition}: Props) => {
  const filteredMatches = matches
    ?.filter(m => m.competition.toLowerCase() === selectedCompetition.toLowerCase())
    .map(m => ({ ...m, matchDateTime: new Date(m.matchDateTime) }))
    .sort((a, b) => b.matchDateTime.getTime() - a.matchDateTime.getTime());

  return (
    <div className="flex justify-center">
      <ul>
        { filteredMatches?.map(match =>
          <li key={ match.id }>
            <Link to={ `${ match.id }` }>
              <MatchCard match={ match }/>
            </Link>
          </li>
        ) }
      </ul>
    </div>
  )
}
export default Matches;