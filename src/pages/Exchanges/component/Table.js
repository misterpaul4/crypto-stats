import PropTypes from "prop-types";
import { Table } from "antd";
import PageLoader from "../../../app/component/PageLoader";
import useTable from "../../../app/hooks/useTable";
import exchangeColumn from "./column";

function ExchangeTable({ refetch, loading, data }) {
  const { TableProps } = useTable({ loading, refetch });

  return (
    <PageLoader loading={!data}>
      {data && (
        <Table
          {...TableProps}
          rowKey={(d) => d.id}
          columns={exchangeColumn()}
          dataSource={Array.isArray(data) ? data : []}
        />
      )}
    </PageLoader>
  );
}

ExchangeTable.defaultProps = {
  data: undefined,
};

ExchangeTable.propTypes = {
  refetch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
};

export default ExchangeTable;
