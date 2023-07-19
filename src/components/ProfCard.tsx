import { ActionIcon, Flex, Image, Paper } from "@mantine/core";
import Logo from "data-base64:~assets/Logo.svg";
import { useCallback, useEffect, useState } from "react";
import { X as XIcon } from "tabler-icons-react";

import { sendToBackground } from "@plasmohq/messaging";

import type { ProfessorPage } from "~background/messages/get-rating";
import { ProfRating } from "~components/ProfRating";

import { ProfProfileBtn } from "./ProfProfileBtn";

interface ProfCardProps {
  professorId: string;
  onClose: () => void;
}

const ProfCard = ({ professorId, onClose }: ProfCardProps) => {
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
    <Paper
      sx={{
        width: "325px",
        minHeight: "260px",
        padding: 12
      }}
      shadow="md">
      <Flex direction="column" sx={{ height: "100%" }}>
        <Flex justify="space-between" align="center">
          <Image
            src={Logo}
            fit="contain"
            height="20px"
            imageProps={{ style: { objectPosition: "left" } }}
          />
          <ActionIcon onClick={onClose}>
            <XIcon size="20px" />
          </ActionIcon>
        </Flex>

        <ProfRating professor={professor} sx={{ flex: 1 }} />

        <Flex justify="end">
          <ProfProfileBtn professor={professor} />
        </Flex>
      </Flex>
    </Paper>
  );
};
export { ProfCard };
