import { Select } from "@mantine/core";
import { useMemo } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { universities } from "~assets/universities";

const UniversitySelect = () => {
  const [university, setUniversity] = useStorage("university");

  const allUniversities = useMemo(() => {
    let _allUniv = [...new Set(universities)];

    if (university && !_allUniv.includes(university)) _allUniv.push(university);

    return _allUniv;
  }, [universities, university]);

  return (
    <Select
      label="Choose your university"
      placeholder="Search..."
      searchable
      clearable
      creatable
      getCreateLabel={(query) => `Other: '${query}'`}
      required
      data={allUniversities}
      value={university}
      maxDropdownHeight={150}
      onChange={(u) => setUniversity(u)}
      onCreate={(u) => {
        setUniversity(u);
        return u;
      }}
    />
  );
};

export { UniversitySelect };
