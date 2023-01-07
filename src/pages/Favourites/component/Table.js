import { Table } from "antd";
import PageLoader from "../../../app/component/PageLoader";
import useTable from "../../../app/hooks/useTable";
import columns from "./columns";

const FavouritesTable = ({ data, loading, refetch }) => {
  const { TableProps } = useTable({ loading, refetch });

  return (
    <PageLoader loading={!data}>
      <Table
        {...TableProps}
        className="container-fluid"
        rowKey={(data) => data.id}
        dataSource={data || []}
        columns={columns()}
      />
    </PageLoader>
  );
};

export default FavouritesTable