import React, { useState } from "react";
import { Avatar, Button, Space, Table as ATable, Tag, Typography } from "antd";
import columns from "./columns";
import DetailsDrawer from "./DetailsDrawer";
import { FiRefreshCcw } from "react-icons/fi";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { displayData } from "../../../utils/display";
import CryptoDetails from "./CryptoDetails";
import PageLoader from "../../../app/component/PageLoader";

const App = ({ cryptos, loading, refetch }) => {
  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState();

  const [tableSort, setTableSort] = useState();
  const [tableFilters, setTableFilters] = useState();

  const onDetailsClose = () => {
    setDrawerVisibility(false);
    setSelectedCrypto(undefined);
  };

  const onDetailsOpen = (crypto) => {
    setDrawerVisibility(true);
    setSelectedCrypto(crypto);
  };

  const handleTableChange = (
    pagination,
    filters,
    sorter,
    { action, currentDataSource }
  ) => {
    switch (action) {
      case "sort":
        if (sorter.column)
          setTableSort({ order: sorter.order, column: sorter.column.title });
        else setTableSort(undefined);
        break;

      case "filter":
        const appliedFilters = [];
        for (const key in filters) {
          const value = filters[key];
          if (value) {
            value.forEach((item) => {
              appliedFilters.push(item);
            });
          }
        }
        if (appliedFilters.length) setTableFilters(appliedFilters);
        else setTableFilters(undefined);
        break;

      default:
        break;
    }
  };

  const renderTableSorts = () => {
    const { icon, tagColor } =
      tableSort.order === "ascend"
        ? { tagColor: "lime", icon: <AiFillCaretUp className="mr-1" /> }
        : { tagColor: "green", icon: <AiFillCaretDown className="mr-1" /> };
    return (
      <Tag color={tagColor} className="d-flex align-items-center" icon={icon}>
        {tableSort.column}
      </Tag>
    );
  };

  const renderTableFilters = () =>
    tableFilters.map((f) => (
      <Tag color="blue" key={f.title}>
        {f.title.toUpperCase()}(<strong>{displayData(f.value)}</strong>)
      </Tag>
    ));

  const TableExtraActions = (arg) => {
    return (
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex flex-wrap">
          {tableSort && renderTableSorts()}
          {tableFilters && renderTableFilters()}
        </div>

        <Space>
          {arg?.range && (
            <Tag
              color="blue"
              className="py-1 px-2"
              style={{ fontSize: "1rem" }}
            >
              Showing <strong>{arg.range.toString().slice(2)}</strong> out of{" "}
              <strong>{arg.total}</strong>
            </Tag>
          )}
          <Button
            className="d-flex align-items-center"
            icon={<FiRefreshCcw className="mr-1" />}
            loading={loading}
            onClick={refetch}
          >
            Refresh
          </Button>
        </Space>
      </div>
    );
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
          title={(currentPageData) =>
            !currentPageData.length && (
              <div className="py-3 w-100">{TableExtraActions()}</div>
            )
          }
          showSorterTooltip={false}
          sticky
          columns={columns(onDetailsOpen)}
          rowKey={(d) => d.id}
          dataSource={cryptos || []}
          scroll={{ x: "max-content", y: "73vh" }}
          onChange={handleTableChange}
          pagination={{
            position: ["topRight"],
            defaultPageSize: "100",
            pageSizeOptions: ["50", "100", "150", "200", "250"],
            showTotal: (total, range) => TableExtraActions({ total, range }),
          }}
        />
      </div>
    </PageLoader>
  );
};

export default App;
