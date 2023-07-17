import { Button } from "@mantine/core";
import { ArrowNarrowRight as ArrowIcon } from "tabler-icons-react";

import type { ProfessorPage } from "~background/messages/get-rating";

type ProfProfileBtnProps = {
  professor: ProfessorPage;
};

const ProfProfileBtn = ({ professor }: ProfProfileBtnProps) => (
  <Button
    component="a"
    href={`https://www.ratemyprofessors.com/professor/${professor.legacyId}`}
    target="_blank"
    rightIcon={<ArrowIcon />}>
    RMP Profile
  </Button>
);

export { ProfProfileBtn };
