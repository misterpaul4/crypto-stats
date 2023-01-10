import { useState } from "react";
import { getLs, setLS } from "../../utils/localStorage";

const useLocalStorage = ({ key }) => {
  const [state, setState] = useState(getLs(key));

  const update = (newValue) => {
    setLS(key, newValue);
    setState(newValue);
  };

  return [state, update];
};

export default useLocalStorage;
