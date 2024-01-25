export default function extractDate(date: Date | null) {
  if (date) {
    return String(date).split('T')[0];
  }
  return null;
}