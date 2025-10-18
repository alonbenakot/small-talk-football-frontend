import MatchModel, { Team } from "./models/MatchModel.ts";

type Props = {
  match: MatchModel
}
const MatchCard = ({match}: Props) => {
  const homeTeam: Team = match.homeTeam;
  const awayTeam: Team = match.awayTeam;
  return (
    <div>
      <div className="flex items-center gap-2">
        <img src={ homeTeam.crest } alt={ homeTeam.name } className="w-8 h-8 rounded-full shadow"/>
        <span>{ homeTeam.name }</span>
        <span className="mx-1">vs</span>
        <img src={ awayTeam.crest } alt={ awayTeam.name } className="w-8 h-8 rounded-full shadow"/>
        <span>{ awayTeam.name }</span>
      </div>
      <h5 className="text-lg font-semibold">{ `${ match.score.home } - ${ match.score.away }` }</h5>
    </div>
  )
}
export default MatchCard;