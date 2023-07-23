import {
  AppShell,
  Box,
  Button,
  Modal,
  Overlay,
  Paper,
  Stack,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import { useDisclosure, useTimeout } from "@mantine/hooks";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { sendToBackground } from "@plasmohq/messaging";
import { useStorage } from "@plasmohq/storage/hook";

import type { ProfessorPage } from "~background/messages/get-rating";
import { UniversitySelect } from "~components/UniversitySelect";
import { ThemeProvider } from "~theme";

import Header from "./Header";
import { ProfessorView } from "./ProfessorView";
import { SettingsView } from "./SettingsView";

const Popup = () => {
  const [university, setUniversity] = useStorage("university");

  const [professor, setProfessor] = useState<ProfessorPage | undefined>();
  const [settingsOpened, { open: openSettings, close: closeSettings }] =
    useDisclosure();

  const submitRef = useRef<HTMLButtonElement>();
  const { start, clear } = useTimeout(() => {
    setSearchBtnTxt("Search");
  }, 3000);
  const [searchBtnTxt, setSearchBtnTxt] = useState<string>("Search");

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

    if (!_prof) {
      clear();
      start();
      setSearchBtnTxt("Professor not found");
      return;
    }

    setProfessor(_prof);
  };

  return (
    <ThemeProvider withNormalizeCSS withGlobalStyles>
      <AppShell header={<Header onSettingsOpen={openSettings} />} w={350}>
        <ProfessorView
          professor={professor}
          onClose={() => setProfessor(undefined)}
        />
        <SettingsView open={settingsOpened} onClose={closeSettings} />
        <Stack spacing={0}>
          <UniversitySelect
            value={university}
            onChange={(u) => setUniversity(u)}
          />
          <Paper mt="md" shadow="md" withBorder>
            <form onSubmit={handleSubmit(onProfessorLookup)}>
              <Box p="md">
                <Title order={4} mb="xs">
                  Manually Search Professor
                </Title>
                <TextInput
                  label="Name"
                  mb="md"
                  {...register("name", { required: true })}
                />
                <Button type="submit" loading={isSubmitting} fullWidth>
                  {searchBtnTxt}
                </Button>
              </Box>
            </form>
          </Paper>
        </Stack>
      </AppShell>
    </ThemeProvider>
  );
};

export default Popup;
