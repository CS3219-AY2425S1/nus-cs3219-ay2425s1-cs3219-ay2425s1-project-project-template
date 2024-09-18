import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

interface FilterSelectProps {
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  value: string | string[];
  isMulti?: boolean;
}

export function FilterSelect({
  placeholder,
  options,
  onChange,
  isMulti,
  value,
}: FilterSelectProps) {
  return (
    <Select
      onValueChange={onChange}
      {...(isMulti ? { multiple: true } : {})}
      value={isMulti ? undefined : (value as string)}
    >
      <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700">
        {placeholder}
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
