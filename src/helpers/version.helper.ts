// Compares two versions such as 1.0, 1.0.3 or 1.1.0: negative when a < b, 0 when equal, positive when a > b
export const compareVersions = (a: string, b: string) => {
  const left = a.split('.').map(part => parseInt(part, 10) || 0);
  const right = b.split('.').map(part => parseInt(part, 10) || 0);
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const diff = (left[i] || 0) - (right[i] || 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
};
