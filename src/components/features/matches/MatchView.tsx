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
import {AnimatePresence, motion} from "framer-motion";

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

          <motion.h3
              className="text-lg sm:text-xl font-bold text-slate-300 text-center mb-4"
              initial={{opacity: 0, y: -10}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.4}}
          >
            Use AI to sound like a proper fan and impress your friends!
          </motion.h3>

          <AiSpinner isLoading={isLoading}/>

          <div className="relative">
            <AnimatePresence mode="wait">
              {!hasResult &&
                  <motion.div
                      key={`form-${formKey}`}
                      initial={{opacity: 0, scale: 0.95}}
                      animate={{opacity: 1, scale: 1}}
                      exit={{opacity: 0, scale: 0.95}}
                      transition={{duration: 0.5, ease: "easeInOut"}}
                  >
                      <OneLinerForm
                          match={match}
                          isLoading={isLoading}
                          onSubmit={onSubmit}
                      />
                  </motion.div>
              }
              {hasResult && fetchedData &&
                  <motion.div
                      key="result"
                      initial={{opacity: 0, scale: 0.95}}
                      animate={{opacity: 1, scale: 1}}
                      exit={{opacity: 0, scale: 0.95}}
                      transition={{duration: 0.5, ease: "easeInOut"}}
                  >
                      <OneLinerResult
                          oneLinerText={fetchedData.data.text}
                          handleStartOver={handleStartOver}
                      />
                  </motion.div>
              }
            </AnimatePresence>
          </div>
        </div>
      </div>
  );
}

export default MatchView;