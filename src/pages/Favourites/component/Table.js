import PropTypes from "prop-types";
import { Button, Table } from "antd";
import { useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import PageLoader from "../../../app/component/PageLoader";
import useTable from "../../../app/hooks/useTable";
import FavouriteContext from "../context/favouriteContext";
import columns from "./columns";
import { LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import { hiddenColumns, visibleColumns } from "../utils/constants";

function FavouritesTable({ data, loading, refetch, addNew }) {
  const { favourites, onFavouriteUpdate } = useContext(FavouriteContext);

  const { TableProps, columnCustommize } = useTable({
    loading,
    refetch,
    tableName: LOCAL_STORAGE_KEYS.favouritesTable,
    defaultHiddenColumns: hiddenColumns,
    defaultVisibleColumns: visibleColumns,
    extraActions: [
      <Button
        onClick={addNew}
        className="flex-centered"
        icon={<AiOutlinePlus className="mr-1" />}
        key="add-new"
      >
        Add New
      </Button>,
    ],
  });

  return (
    <PageLoader loading={!data}>
      {data && (
        <Table
          {...TableProps}
          className="container-fluid"
          rowKey={(data) => data.id}
          dataSource={Array.isArray(data) ? data : []}
          columns={columns({ favourites, onFavouriteUpdate, columnCustommize })}
        />
      )}
    </PageLoader>
  );
}

FavouritesTable.defaultProps = {
  data: undefined,
};

FavouritesTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
  addNew: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
};

export default FavouritesTable;
