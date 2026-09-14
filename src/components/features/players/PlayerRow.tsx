import {Link} from "react-router-dom";
import SquadPlayer from "./models/SquadPlayer.ts";
import FallbackImage from "../../ui/fallback-image/FallbackImage.tsx";

type Props = {
  player: SquadPlayer;
  teamId: string;
  notable: boolean;
};

const PlayerRow = ({player, teamId, notable}: Props) => {
  return (
      <Link
          to={`/teams/${teamId}/players/${player.id}`}
          className="flex items-center m-2 gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl shadow-sm"
      >
        <FallbackImage
            src={player.image}
            alt={player.name}
            fallback="player"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow object-cover"
        />
        <span className="w-6 text-center text-sm font-semibold text-gray-600">{player.number}</span>
        <span className="flex-1 text-gray-900 font-semibold text-sm sm:text-base flex items-center gap-2">
          {player.name}
          {notable && <span data-testid="notable-dot" className="w-2 h-2 rounded-full bg-emerald-600"/>}
        </span>
        {player.injured &&
            <span className="text-xs font-semibold text-red-600 bg-red-100 rounded-full px-2 py-0.5">Injured</span>
        }
      </Link>
  );
};

export default PlayerRow;
