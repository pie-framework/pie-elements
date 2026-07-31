// Returns true when count is at or above maxSelections (use to block the next selection).
export const reachedMaxSelections = (count, maxSelections) =>
  maxSelections != null && count >= maxSelections;

// Returns true when count strictly exceeds maxSelections (use for validation / isComplete checks).
export const exceedsMaxSelections = (count, maxSelections) =>
  maxSelections != null && count > maxSelections;
