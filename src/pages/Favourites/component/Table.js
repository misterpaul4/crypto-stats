import PropTypes from "prop-types";
import { Button, Table } from "antd";
import { useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import PageLoader from "../../../app/component/PageLoader";
import useTable from "../../../app/hooks/useTable";
import FavouriteContext from "../context/favouriteContext";
import columns from "./columns";

function FavouritesTable({ data, loading, refetch, addNew }) {
  const { favourites, onFavouriteUpdate } = useContext(FavouriteContext);

  const { TableProps } = useTable({
    loading,
    refetch,
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
          columns={columns({ favourites, onFavouriteUpdate })}
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
