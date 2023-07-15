import ratings, { type ITeacherPage } from "@mtucourses/rate-my-professors";

import type { PlasmoMessaging } from "@plasmohq/messaging";

interface ProfessorQuery {
  schoolName: string;
  professorName: string;
}

const handler: PlasmoMessaging.MessageHandler<
  ProfessorQuery,
  ITeacherPage
> = async (req, res) => {
  const schoolName = req.body.schoolName;
  const professorName = req.body.professorName;
  console.log("here");

  const schools = await ratings.searchSchool(schoolName);
  if (schools.length === 0) throw new Error("No schools found!");

  const schoolId = schools[0].id;
  const professors = await ratings.searchTeacher(professorName, schoolId);

  let foundProfessor: ITeacherPage;
  for (const professor of professors) {
    try {
      foundProfessor = await ratings.getTeacher(professor.id);
    } catch (e) {}
  }

  if (!foundProfessor)
    throw new Error("No professor found matching: " + professorName);

  res.send(foundProfessor);
};

export default handler;
