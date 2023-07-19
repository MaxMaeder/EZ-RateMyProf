import { ActionIcon, Flex, Image, Header as MTHeader } from "@mantine/core";
import Logo from "data-base64:~assets/Logo.svg";
import { Settings as SettingsIcon } from "tabler-icons-react";

type HeaderType = {
  onSettingsOpen: () => void;
};

const Header = ({ onSettingsOpen }: HeaderType) => {
  return (
    <MTHeader height={60} p="md">
      <Flex justify="space-between" align="center" sx={{ height: "100%" }}>
        <Image
          src={Logo}
          fit="contain"
          height="30px"
          imageProps={{ style: { objectPosition: "left" } }}
          alt="EZ-RateMyProf Logo"
        />
        <ActionIcon onClick={onSettingsOpen}>
          <SettingsIcon />
        </ActionIcon>
      </Flex>
    </MTHeader>
  );
};

export default Header;
