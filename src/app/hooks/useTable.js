import { Button, Space, Tag } from "antd";
import { useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { FiRefreshCcw } from "react-icons/fi";
import { displayData } from "../../utils/display";

const useTable = ({
  loading,
  refetch,
  pageSizeOptions = ["50", "100", "150", "200", "250"],
  defaultPageSize = "100",
  extraActions = [],
}) => {
  const [tableSort, setTableSort] = useState();
  const [tableFilters, setTableFilters] = useState();

  const onChange = (
    pagination,
    filters,
    sorter,
    { action, currentDataSource }
  ) => {
    const appliedFilters = [];

    switch (action) {
      case "sort":
        if (sorter.column) {
          setTableSort({ order: sorter.order, column: sorter.column.title });
        } else setTableSort(undefined);
        break;

      case "filter":
        Object.keys(filters).forEach((key) => {
          if (filters[key]) {
            filters[key].forEach((item) => {
              appliedFilters.push(item);
            });
          }
        });
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

  // eslint-disable-next-line react/prop-types
  function TableExtraActions({ range, total }) {
    return (
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex flex-wrap">
          {tableSort && renderTableSorts()}
          {tableFilters && renderTableFilters()}
        </div>

        <Space>
          {range && (
            <Tag
              color="blue"
              className="py-1 px-2"
              style={{ fontSize: "1rem" }}
            >
              Showing <strong>{range.toString().slice(2)}</strong> out of{" "}
              <strong>{total}</strong>
            </Tag>
          )}
          {extraActions.map((node) => node)}

          {refetch && (
            <Button
              className="d-flex align-items-center"
              icon={<FiRefreshCcw className="mr-1" />}
              loading={loading}
              onClick={refetch}
            >
              Refresh
            </Button>
          )}
        </Space>
      </div>
    );
  }

  const TableProps = {
    sticky: true,
    scroll: { x: "max-content", y: "73vh" },
    onChange,
    showSorterTooltip: false,
    className: "container-fluid",
    pagination: {
      position: ["topRight"],
      defaultPageSize,
      pageSizeOptions,
      showTotal: (total, range) => TableExtraActions({ total, range }),
    },
    title: (currentPageData) =>
      !currentPageData.length && (
        <div className="py-3 w-100">{TableExtraActions()}</div>
      ),
  };

  return { TableProps };
};

export default useTable;
