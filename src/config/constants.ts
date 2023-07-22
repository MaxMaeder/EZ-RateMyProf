import type { MatcherItem } from "~hooks/useSettings";

// Time before re-showing a "nagging" pop-up
export const timeBeforeReshow = 24 * 60 * 60 * 1000; // 1 day, in ms

export const sensibleBlacklist: MatcherItem[] = [
  { pattern: "canvas.*.edu" },
  { pattern: "*wikipedia.*" },
  { pattern: "*google.*" },
  { pattern: "*ratemyprofessors.com" }
];
