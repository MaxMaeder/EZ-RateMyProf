import {
  AppShell,
  Button,
  Modal,
  Paper,
  Stack,
  TextInput,
  Title
} from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { sendToBackground } from "@plasmohq/messaging";
import { useStorage } from "@plasmohq/storage/hook";

import { universities } from "~assets/universities";
import type { ProfessorPage } from "~background/messages/get-rating";
import { UniversitySelect } from "~components/UniversitySelect";
import { ThemeProvider } from "~theme";

import Header from "./Header";
import { ProfessorView } from "./ProfessorView";
import { SettingsView } from "./SettingsView";

const Popup = () => {
  const [university, setUniversity] = useStorage("university");
  const [professor, setProfessor] = useState<ProfessorPage | undefined>();
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  let allUniversities = [...universities];
  if (university && !allUniversities.includes(university))
    allUniversities.push(university);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm();

  type ProfessorLookupType = {
    name: string;
  };

  const onProfessorLookup = async ({ name }: ProfessorLookupType) => {
    const _prof = await sendToBackground({
      name: "get-rating",
      body: {
        schoolName: university,
        professorName: name
      }
    });
    setProfessor(_prof);
  };

  return (
    <ThemeProvider withNormalizeCSS withGlobalStyles>
      <AppShell
        header={<Header onSettingsOpen={() => setSettingsOpen(true)} />}
        w={350}>
        <ProfessorView
          professor={professor}
          onClose={() => setProfessor(undefined)}
        />
        <SettingsView
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
        <Stack spacing={0}>
          <UniversitySelect
            value={university}
            onChange={(u) => setUniversity(u)}
          />
          <Paper p="md" mt="md" shadow="md" withBorder>
            <form onSubmit={handleSubmit(onProfessorLookup)}>
              {/*<Overlay opacity={0.2} fixed />*/}
              <Title order={4} mb="xs">
                Manually Search Professor
              </Title>
              <TextInput
                label="Name"
                mb="md"
                {...register("name", { required: true })}
              />
              <Button type="submit" loading={isSubmitting} fullWidth>
                Search
              </Button>
            </form>
          </Paper>
        </Stack>
      </AppShell>
    </ThemeProvider>
  );
};

export default Popup;
