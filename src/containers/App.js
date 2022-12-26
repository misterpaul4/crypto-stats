import React from "react";
import PageLoader from "../component/PageLoader";
import { Button, Table as ATable } from "antd";
import columns from "../component/Columns";
import useAPI from "../hooks/useAPI";
import { ALL_TOKENS } from "../settings";

const App = () => {
  const [cryptos, { loading, refetch }] = useAPI({ url: ALL_TOKENS });

  return (
    <PageLoader loading={!cryptos}>
      <div className="container-fluid px-3">
        <ATable
          sticky
          columns={columns()}
          rowKey={(d) => d.id}
          dataSource={cryptos || []}
          scroll={{ x: "auto", y: 500 }}
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

