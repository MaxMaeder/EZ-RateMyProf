import ratings, { type ITeacherPage } from "@mtucourses/rate-my-professors";

import type { PlasmoMessaging } from "@plasmohq/messaging";

import type { ProfessorPage } from "./get-rating";

interface ProfessorIdQuery {
  professorId: string;
}

const handler: PlasmoMessaging.MessageHandler<
  ProfessorIdQuery,
  ProfessorPage
> = async (req, res) => {
  const professorId = req.body.professorId;
  console.log("here");

  const foundProfessor = await ratings.getTeacher(professorId);

  res.send(foundProfessor as ProfessorPage);
};

export default handler;
