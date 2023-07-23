import { TAG_BLACKLIST } from "~config/constants";

import { type NLPFoundPerson, findPeople } from "./findPeople";
import { handlePeople } from "./handlePeople";
import { insertStyles } from "./inject";
import { shouldProceed } from "./proceedCheck";

const walkTree = (startNode: Node) => {
  let people: NLPFoundPerson[] = [];

  const treeWalker = document.createTreeWalker(
    startNode,
    NodeFilter.SHOW_TEXT,
    (node) => {
      const tagName = node.parentElement.tagName;
      return TAG_BLACKLIST.includes(tagName)
        ? NodeFilter.FILTER_SKIP
        : NodeFilter.FILTER_ACCEPT;
    }
  );

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;

    if (!(node instanceof Text)) continue;

    if (node.parentElement.classList.contains("rmp-touched")) continue;
    node.parentElement.classList.add("rmp-touched");

    people.push(...findPeople(node));
  }

  return people;
};

const setUpRater = async () => {
  if (!(await shouldProceed())) return;
  insertStyles();

  handlePeople(walkTree(document.body));

  var observer = new MutationObserver(async (mutations) => {
    let people: NLPFoundPerson[] = [];

    for (let mutation of mutations) {
      for (let addedNode of mutation.addedNodes) {
        if (
          addedNode.parentElement &&
          addedNode.parentElement.querySelectorAll(".rate-inline").length !== 0
        )
          continue;

        people.push(...walkTree(addedNode));
      }
    }

    handlePeople(people);
  });

  observer.observe(document.body, {
    subtree: true,
    characterData: true,
    childList: true
  });
};

window.addEventListener("load", setUpRater);
