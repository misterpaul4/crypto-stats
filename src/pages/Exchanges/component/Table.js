import { Table } from "antd";
import PageLoader from "../../../app/component/PageLoader";
import useTable from "../../../app/hooks/useTable";
import exchangeColumn from "./column";

const ExchangeTable = ({ refetch, loading, data }) => {
  const { TableProps } = useTable({ loading, refetch });

  return (
    <PageLoader loading={!data}>
      {data && (
        <Table
          {...TableProps}
          rowKey={(d) => d.id}
          columns={exchangeColumn()}
          dataSource={data || []}
        />
      )}
    </PageLoader>
  );
};

export default ExchangeTable;
