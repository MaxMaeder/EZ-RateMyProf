import { sendToBackground } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";

import type {
  ProfessorMemoItem,
  ProfessorPage
} from "~background/messages/get-rating";

import type { NLPFoundPerson } from "./findPeople";
import { getBadgeHtml } from "./inject";

const storage = new Storage();

let memo: ProfessorMemoItem[] = [];

const isProfessorPage = (item: ProfessorMemoItem) => {
  let page = item as ProfessorPage;
  return page.firstName && page.lastName;
};

const loadPersonDetails = async (
  person: NLPFoundPerson,
  university: string
) => {
  const name = person.name;
  const nameParts = name.split(/\s+/);
  console.log(memo);

  let professor: ProfessorMemoItem | undefined;
  if (nameParts.length === 1) {
    professor = memo.find((profCandidate) => {
      let profPage = profCandidate as ProfessorPage;

      if (isProfessorPage(profPage)) {
        return (
          profPage.firstName.toLowerCase() === nameParts[0] ||
          profPage.lastName.toLowerCase() === nameParts[0]
        );
      }

      return name === profPage.fullName;
    });
  } else {
    professor = memo.find(({ fullName }: ProfessorPage) => {
      return fullName === name;
    });
  }

  if (professor && !isProfessorPage(professor)) return;

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
  const university = await storage.get("university");

  people.sort((a, b) => b.name.length - a.name.length);

  for (const person of people) {
    await loadPersonDetails(person, university);
  }
};

export { handlePeople };
