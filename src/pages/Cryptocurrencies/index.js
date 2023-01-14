import { ALL_TOKENS } from "../../endpoints";
import useAPI from "../../app/hooks/useAPI";
import Table from "./components/Table";

function CryptocurrencyPage() {
  const [cryptos, { loading, refetch }] = useAPI({ url: ALL_TOKENS });

  return <Table cryptos={cryptos} loading={loading} refetch={refetch} />;
}

export default CryptocurrencyPage;
