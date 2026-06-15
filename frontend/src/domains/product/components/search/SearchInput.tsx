import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <Input
      placeholder="Tìm kiếm sản phẩm..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
