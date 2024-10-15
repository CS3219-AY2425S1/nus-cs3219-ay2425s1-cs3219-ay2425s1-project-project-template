import { useState } from "react";
import {
  Select,
  SelectItem,
  SelectedItems,
  Selection,
} from "@nextui-org/react";

import {
  PythonIcon,
  JavaScriptIcon,
  JavaIcon,
  CSharpIcon,
  CPlusIcon,
  RubyIcon,
  GoLangIcon,
  PhpIcon,
} from "../icons";

import { IconSvgProps } from "@/types";

interface Language {
  key: string | number;
  label: string;
  Icon?: React.FC<IconSvgProps>;
}
interface ProgrammingLanguageDropdownProps {
  onSelect: (selectedItems: string[]) => void;
}
const PROGRAMMING_LANGUAGES: Language[] = [
  { key: "python", label: "Python", Icon: PythonIcon },
  { key: "js", label: "JS", Icon: JavaScriptIcon },
  { key: "java", label: "Java", Icon: JavaIcon },
  { key: "c#", label: "C#", Icon: CSharpIcon },
  { key: "c++", label: "C++", Icon: CPlusIcon },
  { key: "ruby", label: "Ruby", Icon: RubyIcon },
  { key: "go", label: "Go", Icon: GoLangIcon },
  { key: "php", label: "PHP", Icon: PhpIcon },
  { key: "typescript", label: "TypeScript" },
  { key: "swift", label: "Swift" },
  { key: "kotlin", label: "Kotlin" },
  { key: "rust", label: "Rust" },
  { key: "scala", label: "Scala" },
  { key: "r", label: "R" },
  { key: "perl", label: "Perl" },
  { key: "dart", label: "Dart" },
  { key: "haskell", label: "Haskell" },
  { key: "objective-c", label: "Objective-C" },
  { key: "lua", label: "Lua" },
  { key: "elixir", label: "Elixir" },
];

export default function ProgrammingLanguageSelectDropdown({
  onSelect,
}: ProgrammingLanguageDropdownProps) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const onSelectionChange = (selectedItems: Selection) => {
    onSelect(Array.from(selectedItems).map((value) => value as string));
    setSelectedKeys(selectedItems);
  };

  return (
    <Select
      classNames={{
        base: "w-9/12",
        label: "w-1/3 pl-2",
        mainWrapper: "w-2/3",
        trigger: "flex h-30 p-2 items-center",
        value:
          "grid grid-cols-4 gap-y-2 text-center items-center justify-center",
      }}
      items={PROGRAMMING_LANGUAGES}
      label="Programming Language"
      labelPlacement="outside-left"
      placeholder="Select A Programming Language"
      renderValue={(items: SelectedItems<Language>) => {
        return (
          <>
            {items.map((item) => {
              const language: Language | undefined = PROGRAMMING_LANGUAGES.find(
                (language) => language.key === item.textValue!.toLowerCase(),
              );

              return (
                <div
                  key={item.key}
                  className="flex items-center gap-2 rounded-md justify-center"
                >
                  {language?.Icon && <language.Icon />}
                  <p>{item.textValue}</p>
                </div>
              );
            })}
          </>
        );
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      onSelectionChange={onSelectionChange}
    >
      {(item) => (
        <SelectItem
          key={item.key}
          title={item.label}
          {...(item.Icon && { startContent: <item.Icon /> })}
        />
      )}
    </Select>
  );
}
