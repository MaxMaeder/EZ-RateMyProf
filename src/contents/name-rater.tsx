import nlp from "compromise";
import rateInlineText from "data-text:./rate-inline.html";
import styleText from "data-text:./style.css";

import { sendToBackground } from "@plasmohq/messaging";

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

window.addEventListener("load", async () => {
  if (!guessShouldProceed()) return;
  insertStyles();
  console.log("PROCEEDING");

  let people = [];
  const treeWalker = getTxtTreeWalker();
  while (treeWalker.nextNode()) {
    if (!(treeWalker.currentNode instanceof Text)) continue;

    const data = treeWalker.currentNode.data;

    const foundPeople = nlp(data).people().json({ offset: true });
    if (foundPeople.length === 0) continue;
    //console.log(foundPeople);

    for (const foundPerson of foundPeople) {
      const endIndex = foundPerson.offset.start + foundPerson.offset.length;

      people.push({
        node: treeWalker.currentNode,
        name: foundPerson.text.toLowerCase(),
        endIndex
      });
    }
  }

  //res = res.slice(0, endIndex) + rateInlineText + res.slice(endIndex);

  console.log(people);
  let memo = new Map();
  const loadPersonDetails = async (person) => {
    const name = person.name;

    let data = {};
    if (memo.has(name)) {
      data = memo.get(name);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100));
      data = { rating: 5.0 };
    }

    let el = person.node.parentElement;
    let res = person.node.data;

    res =
      res.slice(0, person.endIndex) +
      rateInlineText +
      res.slice(person.endIndex);

    if (el) el.innerHTML = res;
  };

  for (const person of people) {
    loadPersonDetails(person);
  }

  console.log("hi");
  const resp = await sendToBackground({
    name: "get-rating",
    body: {
      name: "Gary Dahl"
    }
  });
  console.log("hii");

  console.log(resp);
});
