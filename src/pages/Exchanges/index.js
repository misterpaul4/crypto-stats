import useAPI from "../../app/hooks/useAPI";
import { EXCHANGES } from "../../endpoints";
import ExchangeTable from "./component/Table";

const ExchangesPage = () => {
  const [data, { loading, refetch }] = useAPI({ url: EXCHANGES });
  return <ExchangeTable data={data} loading={loading} refetch={refetch} />;
};

export default ExchangesPage;
