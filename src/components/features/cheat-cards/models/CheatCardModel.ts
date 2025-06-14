import Lang from "../../language/Lang.ts";

export default interface CheatCardModel {
  id: string,
  title: string,
  subtitle: string,
  infoTexts: InfoText[],
  infoCategory: string,
}

interface InfoText {
  text: string,
  lang: Lang
}