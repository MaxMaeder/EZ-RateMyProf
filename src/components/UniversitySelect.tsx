import { Select, type SelectProps } from "@mantine/core";
import { useMemo } from "react";

import { universities } from "~config/universities";

interface UniversitySelectProps extends Omit<SelectProps, "data"> {
  value: string | undefined;
  onChange: (v: string) => void;
}

const UniversitySelect = ({
  value,
  onChange,
  ...props
}: UniversitySelectProps) => {
  const allUniversities = useMemo(() => {
    let _allUniv = [...new Set(universities)];

    if (value && !_allUniv.includes(value)) _allUniv.push(value);

    return _allUniv;
  }, [universities, value]);

  return (
    <Select
      label="Choose your university"
      placeholder="Search..."
      searchable
      clearable
      creatable
      getCreateLabel={(query) => `Other: '${query}'`}
      data={allUniversities}
      value={value}
      maxDropdownHeight={150}
      onChange={(u) => onChange(u)}
      onCreate={(u) => {
        onChange(u);
        return u;
      }}
      {...props}
    />
  );
};

export { UniversitySelect };
