import {useEffect, useRef} from "react";
import {motion} from "motion/react";
import useApi from "../../../utils/hooks/use-api.ts";
import {SmallTalkResponse} from "../../../models/small-talk-response.ts";
import AiSpinner from "../../ui/spinner/AiSpinner.tsx";
import OneLinerForm from "./OneLinerForm.tsx";
import OneLinerResult from "./OneLinerResult.tsx";
import {OneLinerOption} from "./models/OneLinerOption.ts";

type Props<T, V extends string> = {
  title: string;
  options: OneLinerOption<V>[];
  defaultValue?: V;
  submitLabel?: string;
  fetchOneLiner: (choice: V | undefined) => Promise<SmallTalkResponse<T>>;
  getText: (data: T) => string;
  onResult?: (data: T) => void;
  autoFetch?: boolean;                             // generate once on mount with the default choice
  backLabel: string;
  backTo: string | number;
};

const OneLinerGenerator = <T, V extends string>({
  title, options, defaultValue, submitLabel, fetchOneLiner, getText, onResult, autoFetch, backLabel, backTo,
}: Props<T, V>) => {
  const {isLoading, fetchedData, invokeApi} = useApi<T, V | undefined>(fetchOneLiner);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFetch) invokeApi(defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fetchedData) return;
    onResult?.(fetchedData.data);
    resultRef.current?.scrollIntoView({behavior: "smooth", block: "nearest"});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedData]);

  return (
      <>
        <AiSpinner isLoading={isLoading}/>

        <OneLinerForm
            title={title}
            options={options}
            defaultValue={defaultValue}
            submitLabel={submitLabel}
            backLabel={backLabel}
            backTo={backTo}
            isLoading={isLoading}
            onSubmit={invokeApi}
        />

        {fetchedData &&
            <motion.div
                key={getText(fetchedData.data)}
                ref={resultRef}
                className="mt-4"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, ease: "easeInOut"}}
            >
              <OneLinerResult oneLinerText={getText(fetchedData.data)}/>
            </motion.div>
        }
      </>
  );
};

export default OneLinerGenerator;
