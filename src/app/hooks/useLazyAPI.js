import { useState } from "react";

const useLazyAPI = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const fetchData = () => {
    setLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  };

  return [fetchData, { loading, data }];
};

export default useLazyAPI;
