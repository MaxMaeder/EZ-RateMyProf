import ratings, { type ITeacherPage } from "@mtucourses/rate-my-professors";

import type { PlasmoMessaging } from "@plasmohq/messaging";

interface ProfessorQuery {
  schoolName: string;
  professorName: string;
}

interface ProfessorPage extends ITeacherPage {
  wouldTakeAgainPercent: number;
}

const handler: PlasmoMessaging.MessageHandler<
  ProfessorQuery,
  ProfessorPage | undefined
> = async (req, res) => {
  const schoolName = req.body.schoolName;
  const professorName = req.body.professorName;
  console.log("here");

  const schools = await ratings.searchSchool(schoolName);
  //if (schools.length === 0) throw new Error("No schools found!");
  if (schools.length === 0) return res.send(undefined);

  const schoolId = schools[0].id;
  const professors = await ratings.searchTeacher(professorName, schoolId);

  let foundProfessor: ProfessorPage;
  for (const professor of professors) {
    try {
      foundProfessor = (await ratings.getTeacher(
        professor.id
      )) as ProfessorPage;
    } catch (e) {}
  }

  if (!foundProfessor) return res.send(undefined);
  //throw new Error("No professor found matching: " + professorName);

  res.send(foundProfessor);
};

export default handler;

export type { ProfessorPage };
