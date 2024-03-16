export const dedupe = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};
