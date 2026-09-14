import {TeamFacts} from "./models/TeamOneLiner.ts";
import FallbackImage from "../../ui/fallback-image/FallbackImage.tsx";
import {formatString} from "../../../utils/FormatUtil.ts";

type Props = {
  team: TeamFacts;
  competition: string | null;
};

const TeamHeader = ({team, competition}: Props) => {
  return (
      <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl shadow-sm">
        <FallbackImage
            src={team.crest}
            alt={team.name}
            fallback="crest"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow object-contain"
        />
        <div className="flex flex-col">
          <h1 className="text-gray-900 font-bold text-lg sm:text-2xl">{team.name}</h1>
          {competition && <span className="text-xs sm:text-sm text-gray-600">{formatString(competition)}</span>}
        </div>
      </div>
  );
};

export default TeamHeader;
