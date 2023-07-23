import { Drawer, Flex } from "@mantine/core";

import type { ProfessorPage } from "~background/messages/get-rating";
import { ProfProfileBtn } from "~components/ProfProfileBtn";
import { ProfRating } from "~components/ProfRating";

type ProfessorViewType = {
  professor: ProfessorPage | undefined;
  onClose: () => void;
};

const ProfessorView = ({ professor, onClose }: ProfessorViewType) => {
  if (!professor) return null;

  return (
    <Drawer
      position="top"
      size="100%"
      title="Professor Details"
      opened={true}
      onClose={onClose}>
      <ProfRating professor={professor} />
      <Flex justify="end">
        <ProfProfileBtn professor={professor} />
      </Flex>
    </Drawer>
  );
};

export { ProfessorView };
