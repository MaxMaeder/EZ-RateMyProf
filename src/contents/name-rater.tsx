import nlp from "compromise";
import type { PlasmoGetInlineAnchorList, PlasmoGetStyle } from "plasmo";

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style");
  style.textContent = `
    p {
      color: red;
    }
    .rate-inline {
      color: blue;
      background-color: yellow;
    }
  `;
  return style;
};

let el = [];
export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  return el;
};

const PROCEED_KEYWORDS = ["COURSE", "SCHEDULE", "PROFESSOR"];
const TAG_BLACKLIST = ["STYLE", "SCRIPT", "NOSCRIPT", "BODY"];

const guessShouldProceed = () => {
  const pageText = document.body.innerText;
  const matches = nlp(pageText).match(`~(${PROCEED_KEYWORDS.join("|")})~`);
  return matches.found;
};

const getTxtTreeWalker = () =>
  document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, (node) => {
    const tagName = node.parentElement.tagName;
    return TAG_BLACKLIST.includes(tagName)
      ? NodeFilter.FILTER_SKIP
      : NodeFilter.FILTER_ACCEPT;
  });

window.addEventListener("load", () => {
  if (!guessShouldProceed()) return;
  console.log("PROCEEDING");

  let modifications = [];
  const treeWalker = getTxtTreeWalker();
  while (treeWalker.nextNode()) {
    if (!(treeWalker.currentNode instanceof Text)) continue;

    const data = treeWalker.currentNode.data;

    const people = nlp(data).people().json({ offset: true });
    if (people.length === 0) continue;

    let res = data;
    for (const person of people) {
      const endIndex = person.offset.start + person.offset.length;

      res =
        res.slice(0, endIndex) +
        "<span class='rate-inline'>hi</span>" +
        res.slice(endIndex);
      //console.log(person);
    }

    modifications.push([treeWalker.currentNode.parentElement, res]);
    el.push(treeWalker.currentNode.parentElement);
  }

  for (const mod of modifications) {
    mod[0].innerHTML = mod[1];
  }
});
