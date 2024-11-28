import { useEffect, useState } from "react";
import { DEV_MODE } from "../../settings";

const useAPI = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState(false);

  const devMode = DEV_MODE;

  useEffect(() => {
    const fetchData = () => {
      try {
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (devMode) {
              localStorage.setItem(url, JSON.stringify(data));
            }
            setData(data);
          })
          .finally(() => setLoading(false));
      } catch (error) {
        console.error(error);
      }
    };

    setLoading(true);
    if (devMode) {
      const dt = localStorage.getItem(url);

      if (dt) {
        setData(JSON.parse(dt));
        setLoading(false);
      } else {
        fetchData();
      }
    } else {
      fetchData();
    }

    return null;
  }, [refresh]);

  const refetch = () => setRefresh(!refresh);

  return [data, { loading, refetch }];
};

export default useAPI;
