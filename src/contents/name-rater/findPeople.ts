import nlp from "compromise";

interface NLPFoundPerson {
  node: Text;
  name: string;
  endIndex: number;
}

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

const findPeople = (node: Text) => {
  let people: NLPFoundPerson[] = [];

  const data = node.data.toString();
  const foundPeople = nlp(data).people().json({ offset: true });

  if (foundPeople.length === 0) return [];

  for (const foundPerson of foundPeople) {
    const endIndex = foundPerson.offset.start + foundPerson.offset.length;

    people.push({
      node,
      name: formatName(foundPerson.text),
      endIndex
    });
  }

  return people;
};

export { findPeople, type NLPFoundPerson };
