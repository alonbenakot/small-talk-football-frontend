import CheatCardModel from "../models/CheatCardModel.ts";
import { useLangStore } from "../../../../store/store.ts";

type Props = CheatCardModel;

const CheatCard = ({title, subtitle, infoTexts}: Props) => {
  const {selectedLang} = useLangStore();
  return (
    <article>
      <h2>
        { title }
      </h2>
      <h3>
        { subtitle }
      </h3>
      <p>
        {infoTexts.find(text => text.lang === selectedLang.toUpperCase())?.text}
      </p>
    </article>
  )
}

export default CheatCard;