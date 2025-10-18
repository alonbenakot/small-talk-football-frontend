import MatchCard from "./MatchCard.tsx";
import MatchModel from "./models/MatchModel.ts";
type Props = {
  matches: MatchModel[];
}
const Matches = ({matches}: Props) => {
  return (
    <div className="flex justify-center">
      <ul>
        {matches?.map(match =>
          <li key={match.id}>
            <MatchCard match={match}/>
          </li>
        )}
      </ul>
    </div>
  )
}
export default Matches;