import PropTypes from "prop-types";
import { Table } from "antd";
import PageLoader from "../../../app/component/PageLoader";
import useTable from "../../../app/hooks/useTable";
import { LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import {
  derivativeHiddenColumns,
  derivativeVisibleColumns,
} from "../utils/constants";
import derivativesColumn from "./DerivativesColumn";

function DerivativesTable({ refetch, loading, data }) {
  const { TableProps, columnCustommize } = useTable({
    loading,
    refetch,
    tableName: LOCAL_STORAGE_KEYS.derivativesTable,
    defaultHiddenColumns: derivativeHiddenColumns,
    defaultVisibleColumns: derivativeVisibleColumns,
  });

  return (
    <PageLoader loading={!data}>
      {data && (
        <Table
          {...TableProps}
          rowKey={(d) => d.id}
          columns={derivativesColumn(columnCustommize)}
          dataSource={Array.isArray(data) ? data : []}
        />
      )}
    </PageLoader>
  );
}

DerivativesTable.defaultProps = {
  data: undefined,
};

DerivativesTable.propTypes = {
  refetch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
};

export default DerivativesTable;
