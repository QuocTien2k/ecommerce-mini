import { vietnamProvinceService } from "@/services/vietnamProvince.service";
import type { Province, Ward } from "@/types/vietnamProvince";
import { useEffect, useMemo, useState } from "react";

export const useVietnamProvince = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);

        const data = await vietnamProvinceService.getAllProvinces();

        setProvinces(data);
      } catch (err) {
        console.error(err);

        setError("Failed to fetch provinces");
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const getWardsByProvince = (provinceName: string): Ward[] => {
    const province = provinces.find((item) => item.province === provinceName);

    return province?.wards || [];
  };

  const provinceOptions = useMemo(() => {
    return provinces.map((item) => ({
      label: item.province,
      value: item.province,
    }));
  }, [provinces]);

  return {
    provinces,
    provinceOptions,

    loading,
    error,

    getWardsByProvince,
  };
};
