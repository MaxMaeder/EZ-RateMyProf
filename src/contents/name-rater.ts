//const nlp = require("compromise");
import nlp from "compromise";
import rateInlineText from "data-text:./rate-inline.html";
import styleText from "data-text:./style.css";
import { debounce, isEmpty } from "lodash";

import { sendToBackground } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";

import type { ProfessorPage } from "~background/messages/get-rating";

import { getRGColor, map } from "./util";

const PROCEED_KEYWORDS = ["course", "schedule", "professor"];
const TAG_BLACKLIST = ["STYLE", "SCRIPT", "NOSCRIPT", "BODY"];

const storage = new Storage();

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

const getBadgeHtml = (professor: ProfessorPage): string => {
  const rating = professor.avgRating;
  const color = getRGColor(map(rating, 0, 5, 1, 0));

  let text = rateInlineText;
  text = text.replaceAll("(rating)", rating.toString());
  text = text.replaceAll("(color)", color);
  text = text.replaceAll("(id)", professor.id);

  return text;
};

let memo: ProfessorPage[] = [];
const loadPersonDetails = async (
  person: NLPFoundPerson,
  university: string
) => {
  const name = person.name;
  const nameParts = name.split(/\s+/);

  let professor: ProfessorPage | undefined;
  if (nameParts.length === 1) {
    professor = memo.find(({ firstName, lastName }: ProfessorPage) => {
      firstName = firstName.toLowerCase();
      lastName = lastName.toLowerCase();

      return firstName === nameParts[0] || lastName === nameParts[0];
    });
  } else {
    professor = memo.find(({ firstName, lastName }: ProfessorPage) => {
      const fullName = firstName.toLowerCase() + " " + lastName.toLowerCase();
      return fullName === name;
    });
  }

  if (!professor) {
    professor = await sendToBackground({
      name: "get-rating",
      body: {
        schoolName: university,
        professorName: name
      }
    });

    if (!professor) return;
    memo.push(professor);
  }

  let el = person.node.parentElement;
  let res = person.node.data;

  res =
    res.slice(0, person.endIndex) +
    getBadgeHtml(professor) +
    res.slice(person.endIndex);

  if (el) el.innerHTML = res;
};

const formatName = (name: string) => {
  return (
    name
      .toLowerCase()
      // Standardize spaces between words to single space
      .replace(/\s\s+/g, " ")
      // Remove titles like "professor" or "prof.", possessives, and punctuation
      .replace(/(\bprof\w*\b\.?|'s|[,.!?;:])/g, "")
      .trim()
  );
};

const updateProfRatings = async () => {
  console.log("PROCEEDING");
  const university = await storage.get("university");

  let people: NLPFoundPerson[] = [];
  const treeWalker = getTxtTreeWalker();
  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    if (!(node instanceof Text)) continue;
    if (node.parentElement.classList.contains("rmp-touched")) continue;

    const data = node.data.toString();
    const foundPeople = nlp(data).people().json({ offset: true });

    if (foundPeople.length === 0) continue;

    for (const foundPerson of foundPeople) {
      const endIndex = foundPerson.offset.start + foundPerson.offset.length;

      people.push({
        node,
        name: formatName(foundPerson.text),
        endIndex
      });
    }

    node.parentElement.classList.add("rmp-touched");
  }

  people.sort((a, b) => b.name.length - a.name.length);

  for (const person of people) {
    await loadPersonDetails(person, university);
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
