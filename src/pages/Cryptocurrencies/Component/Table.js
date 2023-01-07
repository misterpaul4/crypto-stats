import React, { useState } from "react";
import { Avatar, Button, Space, Table as ATable, Tag, Typography } from "antd";
import columns from "./columns";
import DetailsDrawer from "./DetailsDrawer";
import CryptoDetails from "./CryptoDetails";
import PageLoader from "../../../app/component/PageLoader";
import useTable from "../../../app/hooks/useTable";

const App = ({ cryptos, loading, refetch }) => {
  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState();

  const { TableProps } = useTable({ loading, refetch });

  const onDetailsClose = () => {
    setDrawerVisibility(false);
    setSelectedCrypto(undefined);
  };

  const onDetailsOpen = (crypto) => {
    setDrawerVisibility(true);
    setSelectedCrypto(crypto);
  };

  return (
    <PageLoader loading={!cryptos}>
      <DetailsDrawer
        title={
          <Typography.Title level={3}>
            <Avatar size="small" src={selectedCrypto?.image} />{" "}
            {selectedCrypto?.name}
          </Typography.Title>
        }
        width={"80%"}
        onClose={onDetailsClose}
        visibility={drawerVisibility}
        children={<CryptoDetails id={selectedCrypto?.id} />}
      />
      <div className="container-fluid px-4">
        <ATable
          {...TableProps}
          columns={columns(onDetailsOpen)}
          rowKey={(d) => d.id}
          dataSource={cryptos || []}
        />
      </div>
    </PageLoader>
  );
};

export default App;
