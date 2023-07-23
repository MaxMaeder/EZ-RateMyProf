import nlp from "compromise";
import { isMatch } from "matcher";

import { PROCEED_KEYWORDS, SENSIBLE_BLACKLIST } from "~config/constants";
import { type MatcherItem, getSettings } from "~hooks/useSettings";

const shouldProceed = async () => {
  const { showRatings, runOn, whitelist, blacklist } = await getSettings();
  if (!showRatings.includes("webpages")) return false;

  const matchesHost = (matcherList: MatcherItem[]) => {
    const host = location.hostname;
    const list = matcherList.map(({ pattern }) => pattern);
    return isMatch(host, list);
  };

  switch (runOn) {
    case "whitelist":
      if (!matchesHost(whitelist)) return false;
      break;
    case "blacklist":
      if (matchesHost(blacklist)) return false;
      break;
    case "auto":
      if (matchesHost(SENSIBLE_BLACKLIST)) return false;
      break;
  }

  const pageText = document.body.innerText;
  const matches = nlp(pageText).match(`~(${PROCEED_KEYWORDS.join("|")})~`);
  return matches.found;
};

export { shouldProceed };
