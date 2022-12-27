import React, { useState } from "react";
import PageLoader from "../component/PageLoader";
import { Avatar, Button, Table as ATable, Typography } from "antd";
import columns from "../component/Columns";
import useAPI from "../hooks/useAPI";
import { ALL_TOKENS } from "../settings";
import DetailsDrawer from "../component/DetailsDrawer";
import CryptoDetails from "../component/CryptoDetails";

const App = () => {
  const [cryptos, { loading, refetch }] = useAPI({ url: ALL_TOKENS });
  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [selectedCryptoId, setSelectedCryptoId] = useState();

  const onDetailsClose = () => {
    setDrawerVisibility(false);
    setSelectedCryptoId(undefined);
  };

  const onDetailsOpen = (crypto) => {
    setDrawerVisibility(true);
    setSelectedCryptoId(crypto);
  };

  return (
    <PageLoader loading={!cryptos}>
      <DetailsDrawer
        title={
          <Typography.Title level={3}>
            <Avatar size="small" src={selectedCryptoId?.image} />{" "}
            {selectedCryptoId?.name}
          </Typography.Title>
        }
        width={"50%"}
        onClose={onDetailsClose}
        visibility={drawerVisibility}
        children={<CryptoDetails id={selectedCryptoId?.id} />}
      />
      <div className="container-fluid px-3">
        <ATable
          sticky
          columns={columns(onDetailsOpen)}
          rowKey={(d) => d.id}
          dataSource={cryptos || []}
          scroll={{ x: "auto", y: "75vh" }}
          pagination={{
            position: ["topRight"],
            defaultPageSize: "100",
            pageSizeOptions: ["50", "100", "150", "200", "250"],
            showTotal: () => (
              <Button loading={loading} onClick={refetch}>
                Refresh
              </Button>
            ),
          }}
        />
      </div>
    </PageLoader>
  );
};

export default App;

