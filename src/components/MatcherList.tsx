import {
  Box,
  Button,
  CloseButton,
  Code,
  Group,
  Input,
  Table,
  Text,
  TextInput
} from "@mantine/core";
import { type Control, useFieldArray, useForm } from "react-hook-form";
import { Plus as PlusIcon } from "tabler-icons-react";

import type { MatcherItem } from "~hooks/useSettings";

type MatcherListType = {
  name: string;
  label: string;
  control: Control<any, any>;
  hidden: boolean;
};

const MatcherList = ({ label, name, control, hidden }: MatcherListType) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name
  });
  const matchers = fields as MatcherItem[];

  const { register, handleSubmit, reset } = useForm();

  if (hidden) return null;

  const onAddMatcher = (values: MatcherItem) => {
    append(values);
    reset();
  };

  return (
    <Input.Wrapper label={label}>
      <Table mb="xs">
        <tbody>
          {matchers.map(({ id, pattern }, i) => (
            <tr key={id}>
              <Box sx={{ width: "100%" }} component="td">
                {pattern}
              </Box>
              <td>
                <CloseButton onClick={() => remove(i)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Group>
        <TextInput
          placeholder="Pattern..."
          sx={{ flexGrow: 1 }}
          {...register("pattern", { required: true })}
        />
        <Button
          type="button"
          onClick={handleSubmit(onAddMatcher)}
          leftIcon={<PlusIcon />}>
          Add
        </Button>
        <Text fz="xs">
          <Text span fw="bold">
            Tip:{" "}
          </Text>
          use <Code>*</Code> as a wildcard to match zero or more char.
        </Text>
      </Group>
    </Input.Wrapper>
  );
};

export { MatcherList };
