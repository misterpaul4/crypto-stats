import { useEffect, useState } from "react";

const useAPI = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState(false);

  const save = window.location.href.includes("localhost");

  useEffect(() => {
    const fetchData = () => {
      try {
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (save) {
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
    if (save) {
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
