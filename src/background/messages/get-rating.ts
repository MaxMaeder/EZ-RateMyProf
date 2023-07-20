import ratings, { type ITeacherPage } from "@mtucourses/rate-my-professors";

import { type PlasmoMessaging, sendToContentScript } from "@plasmohq/messaging";

import { showUnivOverlayMsg } from "~config/messages";

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

  if (!schoolName && professorName) {
    sendToContentScript({
      name: "UniversityOverlay",
      body: showUnivOverlayMsg
    });
    return res.send(undefined);
  }

  const schools = await ratings.searchSchool(schoolName);
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

  res.send(foundProfessor);
};

export default handler;

export type { ProfessorPage };
