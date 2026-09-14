import {useState} from "react";
import {useLoaderData, useSearchParams} from "react-router-dom";
import {Scale, Swords} from "lucide-react";
import {motion} from "motion/react";
import {TeamLoaderOutput} from "../routes/loaders/TeamLoader.ts";
import {useLangStore} from "../store/store.ts";
import {getTeamOneLiner} from "../utils/api/http.ts";
import OneLinerGenerator from "../components/features/one-liners/OneLinerGenerator.tsx";
import {OneLinerOption} from "../components/features/one-liners/models/OneLinerOption.ts";
import TeamOneLiner, {TeamFacts as TeamFactsModel} from "../components/features/teams/models/TeamOneLiner.ts";
import {Perspective} from "../components/features/teams/models/Perspective.ts";
import TeamHeader from "../components/features/teams/TeamHeader.tsx";
import TeamFacts from "../components/features/teams/TeamFacts.tsx";
import Squad from "../components/features/players/Squad.tsx";
import FallbackImage from "../components/ui/fallback-image/FallbackImage.tsx";

const TeamPage = () => {
  const {team, squad} = useLoaderData<TeamLoaderOutput>();
  const [searchParams] = useSearchParams();
  const competition = searchParams.get("competition");
  const {selectedLang} = useLangStore();
  const [facts, setFacts] = useState<TeamFactsModel | null>(null);

  const options: OneLinerOption<Perspective>[] = [
    {
      value: Perspective.FAN,
      label: `${team.name} fan`,
      icon: <FallbackImage src={team.crest} alt={`${team.name} crest`} fallback="crest" className="w-8 h-8 object-contain"/>,
    },
    {value: Perspective.RIVAL_FAN, label: "Rival fan", icon: <Swords className="w-6 h-6 text-slate-600"/>},
    {value: Perspective.NEUTRAL, label: "Keep it Neutral", icon: <Scale className="w-6 h-6 text-slate-600"/>},
  ];

  const fetchOneLiner = (perspective: Perspective | undefined) => getTeamOneLiner({
    teamId: team.id,
    lang: selectedLang,
    perspective,
    ...(competition && {competition}),
  });

  return (
      <div className="min-h-screen flex justify-center p-4">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">
          <TeamHeader team={team} competition={competition}/>

          <motion.h3
              className="text-lg sm:text-xl font-bold text-slate-300 text-center mb-4"
              initial={{opacity: 0, y: -10}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.4}}
          >
            Use AI to sound like a proper fan and impress your friends!
          </motion.h3>

          <OneLinerGenerator<TeamOneLiner, Perspective>
              title="Whose side are you on?"
              options={options}
              defaultValue={Perspective.FAN}
              fetchOneLiner={fetchOneLiner}
              getText={(data) => data.oneLiner.text}
              onResult={(data) => setFacts(data.facts)}
              backLabel="Back to Teams"
              backTo="/teams"
          />

          {facts && <TeamFacts facts={facts}/>}

          <Squad
              squad={squad}
              teamId={team.id}
              notablePlayerIds={facts?.notablePlayers.map((p) => p.id) ?? []}
          />
        </div>
      </div>
  );
};

export default TeamPage;
