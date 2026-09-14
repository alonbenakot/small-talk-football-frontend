import SquadPlayer from "./models/SquadPlayer.ts";
import FallbackImage from "../../ui/fallback-image/FallbackImage.tsx";

type Props = {
  player: SquadPlayer;
};

const PlayerHeader = ({player}: Props) => {
  return (
      <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl shadow-sm">
        <FallbackImage
            src={player.image}
            alt={player.name}
            fallback="player"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow object-cover"
        />
        <div className="flex flex-col flex-1">
          <h1 className="text-gray-900 font-bold text-lg sm:text-2xl">{player.name}</h1>
          <span className="text-xs sm:text-sm text-gray-600">
            {player.number && `#${player.number} · `}{player.position}
          </span>
        </div>
        {player.injured &&
            <span className="text-xs font-semibold text-red-600 bg-red-100 rounded-full px-2 py-0.5">Injured</span>
        }
      </div>
  );
};

export default PlayerHeader;
