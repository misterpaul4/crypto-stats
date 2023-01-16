import { Tabs } from "antd";
import { useEffect } from "react";
import { FcCurrencyExchange } from "react-icons/fc";
import { GrMoney } from "react-icons/gr";
import useLazyAPI from "../../app/hooks/useLazyAPI";
import { DERIVATIVES, EXCHANGES } from "../../endpoints";
import DerivativesTable from "./component/DerivativesTable";
import ExchangeTable from "./component/Table";

function ExchangesPage() {
  const [getExchanges, { loading: exchangeLoading, data: exchanges }] =
    useLazyAPI({
      url: EXCHANGES,
    });

  const [getDerivaties, { loading: derivatiesLoading, data: derivaties }] =
    useLazyAPI({
      url: DERIVATIVES,
    });

  useEffect(() => {
    getExchanges();
  }, []);

  const getDerivativesData = () => {
    if (!derivaties) {
      getDerivaties();
    }
  };

  return (
    <Tabs
      onChange={(key) => key === "derivaties" && getDerivativesData()}
      size="small"
      className="mt-3"
      centered
      type="card"
      items={[
        {
          key: "exchanges",
          label: (
            <span>
              <GrMoney size={20} className="mr-2" /> Exchanges
            </span>
          ),
          children: (
            <ExchangeTable
              data={exchanges}
              loading={exchangeLoading}
              refetch={() => getExchanges(EXCHANGES)}
            />
          ),
        },
        {
          key: "derivaties",
          label: (
            <span>
              <FcCurrencyExchange size={20} className="mr-2" /> Derivatives
            </span>
          ),
          children: (
            <DerivativesTable
              data={derivaties}
              loading={derivatiesLoading}
              refetch={() => getDerivaties(DERIVATIVES)}
            />
          ),
        },
      ]}
    />
  );
}

export default ExchangesPage;
