import { Button, Table } from "antd";
import { useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import PageLoader from "../../../app/component/PageLoader";
import useTable from "../../../app/hooks/useTable";
import { FavouriteContext } from "../context/favouriteContext";
import columns from "./columns";

const FavouritesTable = ({ data, loading, refetch }) => {
  const { addNew } = useContext(FavouriteContext);

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
      {!loading && (
        <Table
          {...TableProps}
          className="container-fluid"
          rowKey={(data) => data.id}
          dataSource={data || []}
          columns={columns()}
        />
      )}
    </PageLoader>
  );
};

export default FavouritesTable;
