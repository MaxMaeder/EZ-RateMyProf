import nlp from "compromise";
import rateInlineText from "data-text:./rate-inline.html";
import styleText from "data-text:./style.css";

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

const insertStyles = () => {
  const style = document.createElement("style");
  style.textContent = styleText;
  document.body.appendChild(style);
};

window.addEventListener("load", () => {
  if (!guessShouldProceed()) return;
  insertStyles();
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

      res = res.slice(0, endIndex) + rateInlineText + res.slice(endIndex);

      modifications.push([treeWalker.currentNode.parentElement, res]);
    }
  }

  for (const mod of modifications) {
    mod[0].innerHTML = mod[1];
  }
});
