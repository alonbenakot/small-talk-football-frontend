import Input from "../../ui/input/Input.tsx";
import {Scale, Sparkles} from "lucide-react";
import MatchModel, {TeamType} from "./models/MatchModel.ts";
import Button from "../../ui/button/Button.tsx";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";

type Props = {
  match: MatchModel;
  isLoading: boolean;
  onSubmit: (data: OneLinerFormData) => void;
};

export type OneLinerFormData = {
  team: TeamType | "NEUTRAL";
}

export const NEUTRAL = "NEUTRAL";

const OneLinerForm = ({onSubmit, match, isLoading}: Props) => {
  const navigate = useNavigate();
  const {register, handleSubmit, watch} = useForm<OneLinerFormData>({
    defaultValues: {
      team: NEUTRAL
    }
  });
  const selectedTeam = watch("team");
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="mb-4 text-xl font-semibold text-zinc-800">
          Choose a team you support and adjust the language
        </h1>

        <div className="space-y-3 mb-6">
          <Input
              label={"Keep it Neutral"}
              id="neutral"
              radioValue={NEUTRAL}
              radio
              checked={selectedTeam === NEUTRAL}
              iconImg={<Scale className="w-6 h-6 text-slate-600"/>}
              {...register("team")}
          />
          <Input
              label={match.homeTeam.name}
              id="homeTeam"
              radioValue={TeamType.HOME}
              radio
              checked={selectedTeam === TeamType.HOME}
              iconImg={
                <img
                    src={match.homeTeam.crest}
                    alt={`${match.homeTeam.name} crest`}
                    className="w-8 h-8 object-contain"
                />
              }
              {...register("team")}
          />
          <Input
              label={match.awayTeam.name}
              id="awayTeam"
              radioValue={TeamType.AWAY}
              radio
              checked={selectedTeam === TeamType.AWAY}
              iconImg={
                <img
                    src={match.awayTeam.crest}
                    alt={`${match.awayTeam.name} crest`}
                    className="w-8 h-8 object-contain"
                />
              }
              {...register("team")}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Button buttonType='cta' type='submit'
                  className="flex-1 flex items-center justify-center gap-2">
            {isLoading ? 'Generating...' : 'Generate One-Liner!'}
            <Sparkles className="w-4 h-4"/>
          </Button>
          <Button buttonType='secondary' type='button' onClick={() => navigate(-1)}>
            Back to Matches
          </Button>
        </div>
      </form>
    </div>
  )
}
export default OneLinerForm;