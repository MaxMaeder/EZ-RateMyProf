import { Flex } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import { sendToBackground } from "@plasmohq/messaging";

import type { ProfessorPage } from "~background/messages/get-rating";
import { ProfRating } from "~components/ProfRating";

import { ProfProfileBtn } from "./ProfProfileBtn";

interface ProfDetailsProps {
  professorId: string;
}

const ProfDetails = ({ professorId }: ProfDetailsProps) => {
  const [professor, setProfessor] = useState<ProfessorPage | undefined>();

  const getProfessor = useCallback(async (id: string) => {
    const _prof = await sendToBackground({
      name: "get-rating-id",
      body: {
        professorId: id
      }
    });
    setProfessor(_prof);
  }, []);

  useEffect(() => {
    setProfessor(undefined);
    getProfessor(professorId);
  }, [professorId]);

  if (!professor) return <></>;

  return (
    <>
      <ProfRating professor={professor} sx={{ flex: 1 }} />

      <Flex justify="end">
        <ProfProfileBtn professor={professor} />
      </Flex>
    </>
  );
};
export { ProfDetails };
