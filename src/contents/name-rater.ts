import type { ITeacherPage } from "@mtucourses/rate-my-professors";
import nlp from "compromise";
import rateInlineText from "data-text:./rate-inline.html";
import styleText from "data-text:./style.css";
import { debounce, isEmpty } from "lodash";
import type { PlasmoCSUIProps } from "plasmo";
import type { PlasmoGetOverlayAnchor } from "plasmo";
import type { FC } from "react";

import { sendToBackground } from "@plasmohq/messaging";

import { getRGColor, map } from "./util";

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

interface NLPFoundPerson {
  node: Text;
  name: string;
  endIndex: number;
}

const getBadgeHtml = (professor: ITeacherPage): string => {
  const rating = professor.avgRating;
  const color = getRGColor(map(rating, 0, 5, 1, 0));

  let text = rateInlineText;
  text = text.replaceAll("(rating)", rating.toString());
  text = text.replaceAll("(color)", color);
  text = text.replaceAll("(id)", professor.id);

  return text;
};

let id = "";

const updateProfRatings = async () => {
  console.log("PROCEEDING");

  let people: NLPFoundPerson[] = [];
  const treeWalker = getTxtTreeWalker();
  while (treeWalker.nextNode()) {
    if (!(treeWalker.currentNode instanceof Text)) continue;

    const data = treeWalker.currentNode.data;

    const foundPeople = nlp(data).people().json({ offset: true });
    if (foundPeople.length === 0) continue;

    for (const foundPerson of foundPeople) {
      const endIndex = foundPerson.offset.start + foundPerson.offset.length;

      people.push({
        node: treeWalker.currentNode,
        name: foundPerson.text.toLowerCase(),
        endIndex
      });
    }
  }

  let memo = new Map<string, ITeacherPage>();

  const loadPersonDetails = async (person: NLPFoundPerson) => {
    const name = person.name;

    let professor: ITeacherPage;
    if (memo.has(name)) {
      professor = memo.get(name);
    } else {
      professor = await sendToBackground({
        name: "get-rating",
        body: {
          schoolName: "UW-Madison",
          professorName: name
        }
      });
      memo.set(name, professor);
    }

    let el = person.node.parentElement;
    let res = person.node.data;

    res =
      res.slice(0, person.endIndex) +
      getBadgeHtml(professor) +
      res.slice(person.endIndex);

    if (el) el.innerHTML = res;
  };

  for (const person of people) {
    loadPersonDetails(person);
  }
};

const db_updateProfRatings = debounce(updateProfRatings, 1000);

const setUpRater = () => {
  if (!guessShouldProceed()) return;
  insertStyles();
  updateProfRatings();

  var observer = new MutationObserver((mutations) => {
    if (mutations.length < 30) {
      let valid = false;
      for (let mutation of mutations) {
        for (let addedNode of mutation.addedNodes) {
          if (!(addedNode instanceof HTMLElement && addedNode instanceof Text))
            continue;

          if (
            !isEmpty(addedNode.innerHTML) &&
            !addedNode.classList.contains("rate-inline")
          ) {
            valid = true;
            break;
          }
        }

        if (valid) break;
      }

      if (!valid) return;
    }

    db_updateProfRatings();
  });

  observer.observe(document, {
    subtree: true,
    childList: true
  });
};

window.addEventListener("load", setUpRater);
