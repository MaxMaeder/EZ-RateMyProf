import rateInlineText from "data-text:./../inline-badge/rate-inline.html";
import styleText from "data-text:./../inline-badge/style.css";

import type { ProfessorPage } from "~background/messages/get-rating";
import { map } from "~contents/util";

const insertStyles = () => {
  const style = document.createElement("style");
  style.textContent = styleText;
  document.body.appendChild(style);
};

const getBadgeHtml = (professor: ProfessorPage): string => {
  const rating = professor.avgRating;
  const color = getRGColor(map(rating, 0, 5, 1, 0));

  let text = rateInlineText;
  text = text.replaceAll("(rating)", rating.toString());
  text = text.replaceAll("(color)", color);
  text = text.replaceAll("(id)", professor.id);

  return text;
};

/*
Map 0 to 1 to RED to GREEN
*/
const getRGColor = (value: number): string => {
  //value from 0 to 1
  var hue = ((1 - value) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
};

export { insertStyles, getBadgeHtml };
