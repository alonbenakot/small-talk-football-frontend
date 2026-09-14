export const formatString = (text: string) => {
  return text
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const subStringUntilColon = (text: string) => {
  const colonIndex = text.indexOf(':');
  return colonIndex === -1 ? text : text.substring(0, colonIndex);
}

export const formatParams = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z]/g, ' ') // replace any non-letter with space
    .replace(/\s+/g, ' ')     // collapse multiple spaces
    .trim();                  // remove leading/trailing spaces
};
export const ordinal = (n: number) => {
  const rem = n % 100;
  const suffix = rem >= 11 && rem <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th";
  return `${n}${suffix}`;
}
