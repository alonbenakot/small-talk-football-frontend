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