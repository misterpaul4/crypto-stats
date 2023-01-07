import { ALL_TOKENS } from "../../endpoints";
import useAPI from "../../app/hooks/useAPI";
import App from "./Component/Table";

const AppWrapper = () => {
  const [cryptos, { loading, refetch }] = useAPI({ url: ALL_TOKENS });

  return <App cryptos={cryptos} loading={loading} refetch={refetch} />;
};

export default AppWrapper;

