import {useLoaderData, useSearchParams} from "react-router-dom";
import {Scale, Swords} from "lucide-react";
import {TeamLoaderOutput} from "../routes/loaders/TeamLoader.ts";
import {useLangStore} from "../store/store.ts";
import {getTeamOneLiner} from "../utils/api/http.ts";
import OneLinerGenerator from "../components/features/one-liners/OneLinerGenerator.tsx";
import {OneLinerOption} from "../components/features/one-liners/models/OneLinerOption.ts";
import TeamOneLiner from "../components/features/teams/models/TeamOneLiner.ts";
import {Perspective} from "../components/features/teams/models/Perspective.ts";
import TeamHeader from "../components/features/teams/TeamHeader.tsx";
import TeamFacts from "../components/features/teams/TeamFacts.tsx";
import Squad from "../components/features/players/Squad.tsx";
import FallbackImage from "../components/ui/fallback-image/FallbackImage.tsx";

const TeamPage = () => {
  const {facts, squad} = useLoaderData<TeamLoaderOutput>();
  const [searchParams] = useSearchParams();
  const competition = searchParams.get("competition");
  const {selectedLang} = useLangStore();

  const options: OneLinerOption<Perspective>[] = [
    {
      value: Perspective.FAN,
      label: `${facts.name} fan`,
      icon: <FallbackImage src={facts.crest} alt={`${facts.name} crest`} fallback="crest" className="w-8 h-8 object-contain"/>,
    },
    {value: Perspective.RIVAL_FAN, label: "Rival fan", icon: <Swords className="w-6 h-6 text-slate-600"/>},
    {value: Perspective.NEUTRAL, label: "Keep it Neutral", icon: <Scale className="w-6 h-6 text-slate-600"/>},
  ];

  const fetchOneLiner = (perspective: Perspective | undefined) => getTeamOneLiner({
    teamId: facts.id,
    lang: selectedLang,
    perspective,
    ...(competition && {competition}),
  });

  return (
      <div className="min-h-screen flex justify-center p-4">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">
          <TeamHeader team={facts} competition={competition}/>


          <OneLinerGenerator<TeamOneLiner, Perspective>
              title="Whose side are you on?"
              options={options}
              defaultValue={Perspective.FAN}
              fetchOneLiner={fetchOneLiner}
              getText={(data) => data.oneLiner.text}
              backLabel="Back to Teams"
              backTo="/teams"
          />

          <TeamFacts facts={facts}/>

          <Squad
              squad={squad}
              teamId={facts.id}
              notablePlayerIds={facts.notablePlayers.map((p) => p.id)}
          />
        </div>
      </div>
  );
};

export default TeamPage;
