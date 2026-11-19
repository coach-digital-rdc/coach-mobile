// Appreciation of an observation (B11), from the best to the weakest
export const APPRECIATIONS = [
  'VERY_GOOD',
  'GOOD',
  'FAIRLY_GOOD',
  'INSUFFICIENT',
  'WEAK',
] as const;

// Suggested from the mean of the global scores of the sub-domains (1 to 5):
// 4.5 or more Très bien, 3.5 Bien, 2.5 Assez bien, 1.5 Insuffisant, below Faible
export const getSuggestedAppreciation = (
  scores: (number | null | undefined)[],
): string | undefined => {
  const values = scores.filter(
    (value): value is number => value !== null && value !== undefined,
  );
  if (values.length === 0) {
    return undefined;
  }
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (mean >= 4.5) {
    return 'VERY_GOOD';
  }
  if (mean >= 3.5) {
    return 'GOOD';
  }
  if (mean >= 2.5) {
    return 'FAIRLY_GOOD';
  }
  if (mean >= 1.5) {
    return 'INSUFFICIENT';
  }
  return 'WEAK';
};
