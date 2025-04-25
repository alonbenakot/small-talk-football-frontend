import CheatCardModel from "../models/CheatCardModel.ts";
import { useLangStore } from "../../../../store/store.ts";

type Props = CheatCardModel;

const CheatCard = ({title, subtitle, infoTexts}: Props) => {
  const {selectedLang} = useLangStore();
  return (
    <article className="shadow-sm rounded-2xl border border-gray-200 max-w-3xl">
      <h2 className="block w-full text-xl font-bold bg-zinc-800 text-emerald-600 px-4 py-2 rounded-t-2xl shadow-sm">
        { title }
      </h2>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          { subtitle }
        </h3>
        <p className="text-md text-gray-700">
          { infoTexts.find(text => text.lang === selectedLang.toUpperCase())?.text }
        </p>
      </div>
    </article>
  )
}

export default CheatCard;