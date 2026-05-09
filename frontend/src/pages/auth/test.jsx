import { useState, useEffect } from "react";

const ProvinceList = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://vietnamlabs.com/api/vietnamprovince")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProvinces(data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {provinces.map((province, index) => (
        <div key={index}>
          <h3>{province.province}</h3>
          <ul>
            {province.wards.map((ward, wardIndex) => (
              <li key={wardIndex}>{ward.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProvinceList;
