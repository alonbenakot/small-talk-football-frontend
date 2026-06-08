export enum Lang {
  BRITISH = 'BRITISH',
  AMERICAN = 'AMERICAN',
  HEBREW = 'HEBREW'
}

export const COUNTRY_CODES: Record<Lang, string> = {
  [Lang.AMERICAN]: 'US',
  [Lang.BRITISH]: 'GB',
  [Lang.HEBREW]: 'IL'
}

export const LANGUAGE_LABELS: Record<Lang, string> = {
  [Lang.AMERICAN]: 'American',
  [Lang.BRITISH]: 'British',
  [Lang.HEBREW]: 'Hebrew'
};