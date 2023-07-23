import { sendToBackground } from "@plasmohq/messaging";

import type {
  ProfessorMemoItem,
  ProfessorPage
} from "~background/messages/get-rating";

import type { NLPFoundPerson } from "./findPeople";
import { getBadgeHtml } from "./inject";

let memo: ProfessorMemoItem[] = [];

const loadPersonDetails = async (
  person: NLPFoundPerson,
  university: string
) => {
  const name = person.name;
  const nameParts = name.split(/\s+/);

  let professor: ProfessorMemoItem | undefined;
  if (nameParts.length === 1) {
    professor = memo.find((profCandidate) => {
      let profPage = profCandidate as ProfessorPage;
      if (profPage.firstName && profPage.lastName) {
        return (
          profPage.firstName.toLowerCase() === nameParts[0] ||
          profPage.lastName.toLowerCase() === nameParts[0]
        );
      }

      return false;
    });
  } else {
    professor = memo.find(({ fullName }: ProfessorPage) => {
      //const fullName = firstName.toLowerCase() + " " + lastName.toLowerCase();
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

    if (!professor) {
      let nonExistentProf: ProfessorMemoItem = {
        fullName: name
      };

      memo.push(nonExistentProf);
      return;
    }
    memo.push(professor);
  }

  let el = person.node.parentElement;
  if (!el) return;
  let res = el.innerHTML;

  res =
    res.slice(0, person.endIndex) +
    getBadgeHtml(professor as ProfessorPage) +
    res.slice(person.endIndex);

  if (el) el.innerHTML = res;
};

const handlePeople = async (people: NLPFoundPerson[]) => {
  const storage = new Storage();
  const university = await storage.get("university");

  people.sort((a, b) => b.name.length - a.name.length);

  for (const person of people) {
    try {
      await loadPersonDetails(person, university);
    } catch (e) {}
  }
};

export { handlePeople };
