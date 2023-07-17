import {
  Box,
  type BoxProps,
  Flex,
  Group,
  Rating,
  Text,
  Title
} from "@mantine/core";

import type { ProfessorPage } from "~background/messages/get-rating";

type StatProps = {
  label: string;
  value: string;
};

const Stat = ({ label, value }: StatProps) => (
  <Flex direction="column" align="center">
    <Text fz="xl" fw={700}>
      {value}
    </Text>
    <Text c="dimmed">{label}</Text>
  </Flex>
);

interface ProfRatingProps extends BoxProps {
  professor: ProfessorPage;
}

const ProfRating = ({ professor, ...props }: ProfRatingProps) => {
  return (
    <Box {...props}>
      <Title order={1} sx={{ marginBottom: 5 }}>
        {`${professor.firstName} ${professor.lastName}`}
      </Title>
      <Group spacing="xs">
        <Rating value={professor.avgRating} fractions={10} size="lg" readOnly />
        <Text c="dimmed">{professor.avgRating}/5</Text>
      </Group>
      <Group grow mt="md" mb="md">
        <Stat
          value={`${professor.wouldTakeAgainPercent.toFixed(0)}%`}
          label="Would take again"
        />
        <Stat
          value={`${professor.avgDifficulty}/5`}
          label="Level of difficulty"
        />
      </Group>
    </Box>
  );
};

export { ProfRating };
