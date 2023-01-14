import { useEffect, useState } from "react";

const useAPI = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setData(data);
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.error(error);
    }

    return null;
  }, [refresh]);

  const refetch = () => setRefresh(!refresh);

  return [data, { loading, refetch }];
};

export default useAPI;
