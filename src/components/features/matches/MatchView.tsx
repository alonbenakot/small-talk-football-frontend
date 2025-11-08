import {useLoaderData} from "react-router-dom";
import {MatchLoaderOutput} from "../../../routes/loaders/MatchLoader.ts";
import MatchCard from "./MatchCard.tsx";
import MatchModel from "./models/MatchModel.ts";
import {useLangStore} from "../../../store/store.ts";
import useApi from "../../../utils/hooks/use-api.ts";
import {getOneLiner} from "../../../utils/api/http.ts";
import {OneLinerInput} from "../../../utils/api/api-inputs.ts";
import OneLiner from "./models/OneLiner.ts";
import AiSpinner from "../../ui/spinner/AiSpinner.tsx";
import OneLinerForm, {NEUTRAL, OneLinerFormData} from "./OneLinerForm.tsx";
import OneLinerResult from "./OneLinerResult.tsx";
import {useState} from "react";

const normalizeMatchDate = (match: MatchModel) => ({
  ...match,
  matchDateTime: new Date(match.matchDateTime),
});

const MatchView = () => {
  const {data: match} = useLoaderData<MatchLoaderOutput>();
  const {selectedLang} = useLangStore();
  const [formKey, setFormKey] = useState<number>(0);
  const {isLoading, fetchedData, setFetchedData, invokeApi} = useApi<OneLiner, OneLinerInput>(getOneLiner);


  const onSubmit = (data: OneLinerFormData) => {
    console.log(data);
    invokeApi({
      ...(data.team !== NEUTRAL && {teamType: data.team}),
      lang: selectedLang,
      matchId: match.id,
    });
  }

  const handleStartOver = () => {
    setFetchedData(null);
    setFormKey(prevState => prevState + 1);
  };

  const hasResult: boolean = !!fetchedData && !isLoading;

  return (
      <div className="min-h-screen flex justify-center p-4">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">
          <MatchCard match={normalizeMatchDate(match)}/>

          <h3 className="text-lg sm:text-xl font-bold text-slate-300 text-center mb-4">
            Use AI to sound like a proper fan and impress your friends!
          </h3>

          {isLoading && (
              <div className="bg-white p-6 m-2 rounded-lg shadow-md">
                <AiSpinner isLoading={isLoading}/>
              </div>
          )}

          <div className="relative">
            <div className={`transition-all duration-500 ${
                hasResult ? 'opacity-0 scale-95 pointer-events-none absolute' : 'opacity-100 scale-100'
            }`}>
              <OneLinerForm
                  key={formKey}
                  match={match}
                  isLoading={isLoading}
                  onSubmit={onSubmit}
              />
            </div>
            <div
                className={`transition-all duration-500 ${
                    hasResult ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute inset-0'
                }`}
            >
              {fetchedData &&
                  <OneLinerResult
                      oneLinerText={fetchedData.data.text}
                      handleStartOver={handleStartOver}
                  />
              }
            </div>
          </div>
        </div>
      </div>
  );
}

export default MatchView;