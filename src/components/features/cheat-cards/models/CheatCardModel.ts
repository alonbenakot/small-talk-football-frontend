import Lang from "../../language/Lang.ts";

export default interface CheatCardModel {
  id: number,
  title: string,
  subTitle: string,
  infoTexts: InfoText[],
  infoCategory: string,
}

interface InfoText {
  text: string,
  lang: Lang
}