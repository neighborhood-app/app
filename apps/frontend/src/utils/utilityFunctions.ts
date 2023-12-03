export default function extractDate(date: Date | undefined) {
  if (date) {
    return String(date).split('T')[0];
  }
  return undefined;
}