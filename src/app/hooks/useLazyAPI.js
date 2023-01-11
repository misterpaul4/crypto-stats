import { useState } from "react";

const useLazyAPI = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const fetchData = (newUrl) => {
    setLoading(true);
    fetch(newUrl || url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .finally(() => setLoading(false));
  };

  return [fetchData, { loading, data }];
};

export default useLazyAPI;
