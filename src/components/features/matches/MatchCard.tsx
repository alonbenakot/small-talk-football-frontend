import MatchModel, { Team } from "./models/MatchModel.ts";

type Props = {
  match: MatchModel
}

const team = (team: Team) => {
  return (
    <div className="flex flex-col items-center gap-2 w-24 sm:w-32">
      <img src={ team.crest } alt={ team.name } className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow"/>
      <span className="text-gray-900 font-semibold text-xs sm:text-sm text-center">{ team.name }</span>
    </div>
  );
}

const MatchCard = ({match}: Props) => {
  const homeTeam: Team = match.homeTeam;
  const awayTeam: Team = match.awayTeam;

  return (
    <div
      className="flex flex-col m-2 gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl shadow-sm hover:border-emerald-600 hover:border-2 transition-all duration-50">
      <div className="flex items-center justify-center gap-4 sm:gap-8">
        { team(homeTeam) }

        <div className="flex flex-col items-center min-w-20 sm:min-w-24">
          <h5 className="text-xl sm:text-2xl font-bold text-gray-900">
            { `${ match.score.home } - ${ match.score.away }` }
          </h5>
        </div>

        { team(awayTeam) }
      </div>
    </div>
  )
}

export default MatchCard;