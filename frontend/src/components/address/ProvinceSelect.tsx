import { useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { useProvinces } from "@/hooks/address/useProvinces";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export const ProvinceSelect = ({ value, onChange }: Props) => {
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useProvinces({
    search: debouncedSearch,
  });

  return (
    <div>
      <input
        placeholder="Search province..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select province</option>

        {data?.map((province) => (
          <option key={province.id} value={province.name}>
            {province.name}
          </option>
        ))}
      </select>

      {isLoading && <p>Loading...</p>}
    </div>
  );
};
