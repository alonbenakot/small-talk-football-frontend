import {useLoaderData} from "react-router-dom";
import {MatchLoaderOutput} from "../../../routes/loaders/MatchLoader.ts";
import MatchCard from "./MatchCard.tsx";
import MatchModel, {TeamType} from "./models/MatchModel.ts";
import {useLangStore} from "../../../store/store.ts";
import {getOneLiner} from "../../../utils/api/http.ts";
import OneLiner from "./models/OneLiner.ts";
import OneLinerGenerator from "../one-liners/OneLinerGenerator.tsx";
import {OneLinerOption} from "../one-liners/models/OneLinerOption.ts";
import {Scale} from "lucide-react";
import {motion} from "motion/react";

const NEUTRAL = "NEUTRAL";
type Side = TeamType | typeof NEUTRAL;

const normalizeMatchDate = (match: MatchModel) => ({
  ...match,
  matchDateTime: new Date(match.matchDateTime),
});

const crest = (team: MatchModel["homeTeam"]) => (
    <img src={team.crest} alt={`${team.name} crest`} className="w-8 h-8 object-contain"/>
);

const MatchView = () => {
  const {data: match} = useLoaderData<MatchLoaderOutput>();
  const {selectedLang} = useLangStore();

  const options: OneLinerOption<Side>[] = [
    {value: TeamType.HOME, label: match.homeTeam.name, icon: crest(match.homeTeam)},
    {value: TeamType.AWAY, label: match.awayTeam.name, icon: crest(match.awayTeam)},
    {value: NEUTRAL, label: "Keep it Neutral", icon: <Scale className="w-6 h-6 text-slate-600"/>},
  ];

  const fetchOneLiner = (side: Side | undefined) => getOneLiner({
    ...(side !== NEUTRAL && {teamType: side}),
    lang: selectedLang,
    matchId: match.id,
  });

  return (
      <div className="min-h-screen flex justify-center p-4">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">
          <MatchCard match={normalizeMatchDate(match)}/>

          <motion.h3
              className="text-lg sm:text-xl font-bold text-slate-300 text-center mb-4"
              initial={{opacity: 0, y: -10}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.4}}
          >
            Use AI to sound like a proper fan and impress your friends!
          </motion.h3>

          <OneLinerGenerator<OneLiner, Side>
              title="Choose your team!"
              options={options}
              defaultValue={TeamType.HOME}
              fetchOneLiner={fetchOneLiner}
              getText={(data) => data.text}
              backLabel="Back to Matches"
              backTo={-1}
          />
        </div>
      </div>
  );
}

export default MatchView;
