export function processStreamText(text: any) {
  let processStreamText = text.join(" ").replace(/\s+/g, " ");
  return processStreamText;
}
