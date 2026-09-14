import {Link} from "react-router-dom";
import {TeamSummary} from "./models/TeamsResponse.ts";
import FallbackImage from "../../ui/fallback-image/FallbackImage.tsx";

type Props = {
  team: TeamSummary;
  to: string;
};

const TeamRow = ({team, to}: Props) => {
  return (
      <Link to={to} className="flex items-center m-2 gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl shadow-sm">
        <span className="w-6 text-center text-sm font-semibold text-gray-600">{team.position}</span>
        <FallbackImage
            src={team.crest}
            alt={team.name}
            fallback="crest"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow object-contain"
        />
        <span className="flex-1 text-gray-900 font-semibold text-sm sm:text-base">{team.name}</span>
        <span className="text-gray-900 font-bold text-sm sm:text-base">{team.points} pts</span>
      </Link>
  );
};

export default TeamRow;
