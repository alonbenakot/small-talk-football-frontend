import {useLoaderData, useNavigate} from "react-router-dom";
import {MatchLoaderOutput} from "../../../routes/loaders/MatchLoader.ts";
import MatchCard from "./MatchCard.tsx";
import MatchModel from "./models/MatchModel.ts";
import Button from "../../ui/button/Button.tsx";
import Input from "../../ui/input/Input.tsx";
import {useForm} from "react-hook-form";
import {useLangStore} from "../../../store/store.ts";
import useApi from "../../../utils/hooks/use-api.ts";
import {getOneLiner} from "../../../utils/api/http.ts";
import {OneLinerInput} from "../../../utils/api/api-inputs.ts";
import {TeamType} from "./models/TeamType.tsx";

const normalizeMatchDate = (match: MatchModel) => ({
  ...match,
  matchDateTime: new Date(match.matchDateTime),
});

type FormData = {
  team: TeamType | null;
}

const MatchView = () => {
  const {data: match} = useLoaderData<MatchLoaderOutput>();
  const navigate = useNavigate();
  const {selectedLang} = useLangStore();
  const {register, handleSubmit, reset, formState} = useForm<FormData>({
    defaultValues: {
      team: null
    }
  });
  const {isLoading, error, fetchedData} = useApi<string, OneLinerInput>(getOneLiner);

  const onSubmit = (data: FormData) => {
    console.log(data);
    getOneLiner({
      ...(data.team && {teamType: data.team}),
      lang: selectedLang,
      matchId: match.id,
    });


    return (
        <div className="min-h-screen flex justify-center p-4">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">
            <MatchCard match={normalizeMatchDate(match)}/>

            <h3 className="text-lg sm:text-xl font-bold text-slate-300 text-center mb-4">
              Use AI to sound like a proper fan and impress your friends!
            </h3>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className="mb-4 text-xl font-semibold">Choose a team you support and adjust the language</h1>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <img
                        src={match.homeTeam.crest}
                        alt={`${match.homeTeam.name} crest`}
                        className="w-8 h-8 object-contain"
                    />
                    <Input
                        label={match.homeTeam.name}
                        id="homeTeam"
                        radioValue={TeamType.HOME}
                        radio
                        {...register("team")}
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <img
                        src={match.awayTeam.crest}
                        alt={`${match.awayTeam.name} crest`}
                        className="w-8 h-8 object-contain"
                    />
                    <Input
                        label={match.awayTeam.name}
                        id="awayTeam"
                        radioValue={TeamType.AWAY}
                        radio
                        {...register("team")}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div className="flex gap-2">
                    <Button buttonType='primary' type='button' onClick={() => reset()} disabled={!formState.isDirty}>
                      I regret! I don't support either team
                    </Button>
                    <Button buttonType='cta' type='submit'>
                      Generate One-Liner!
                    </Button>
                  </div>
                  <Button buttonType='secondary' type='button' onClick={() => navigate(-1)}>
                    Back
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
    );
  };
}

export default MatchView;