/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/destructuring-assignment */
import {
  Button,
  List,
  Modal,
  Radio,
  Slider,
  Space,
  Switch,
  Tag,
  Typography,
} from "antd";
import { useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { FiRefreshCcw } from "react-icons/fi";
import { CiSettings } from "react-icons/ci";
import { BsTable } from "react-icons/bs";
import { displayData } from "../../utils/display";
import useLocalStorage from "./useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "../../utils/localStorage";
import {
  PAGINATION_PLACEMENT,
  TABLE_SCROLL,
  TABLE_SIZE,
} from "../constants/options";
import { modalProps } from "../../utils/modal";
import ColumnCustomizer from "../component/helpers/ColumnCustomizer";

const useTable = ({
  loading,
  refetch,
  pageSizeOptions = ["50", "100", "150", "200", "250"],
  extraActions = [],
  tableName = "",
  defaultVisibleColumns = [],
  defaultHiddenColumns = [],
}) => {
  const [tableSort, setTableSort] = useState();
  const [tableFilters, setTableFilters] = useState();

  const [columnCustommize, setColumnCustomize] = useLocalStorage({
    key: tableName,
    fallback: {
      visible: defaultVisibleColumns,
      hidden: defaultHiddenColumns,
    },
  });

  const [tableSize, setTableSize] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.tableSize,
    fallback: TABLE_SIZE.middle,
  });

  const [tableBorder, setTableBorder] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.tableBorders,
    fallback: false,
  });

  const [tableScroll, setTableScroll] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.tableScroll,
    fallback: TABLE_SCROLL.fixed,
  });

  const [pageSize, setPageSize] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.pageSize,
    fallback: 100,
  });

  const [paginationPlacement, setPaginationPlacement] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.paginationPlacement,
    fallback: PAGINATION_PLACEMENT.topRight,
  });

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

  const renderColumnCustomizer = () => {
    const modal = Modal.info();
    modal.update({
      ...modalProps,
      title: <Typography.Title level={4}>Column Customizer</Typography.Title>,
      content: (
        <ColumnCustomizer
          hidden={columnCustommize.hidden}
          visible={columnCustommize.visible}
          onFinish={(visible, hidden) => {
            setColumnCustomize({ visible, hidden });
            modal.destroy();
          }}
          defaultHiddenColumns={defaultHiddenColumns}
          defaultVisibleColumns={defaultVisibleColumns}
        />
      ),
    });
  };

  const renderTableConfigurations = () => {
    const modal = Modal.info();
    modal.update({
      ...modalProps,
      title: (
        <Typography.Title level={4}>Table Configurations</Typography.Title>
      ),
      content: (
        <List>
          {/* size */}
          <List.Item>
            <Space size="large">
              <strong>Size:</strong>
              <Radio.Group
                buttonStyle="solid"
                defaultValue={tableSize}
                onChange={(e) => setTableSize(e.target.value)}
              >
                <Radio.Button value={TABLE_SIZE.small}>Small</Radio.Button>
                <Radio.Button value={TABLE_SIZE.middle}>Normal</Radio.Button>
                <Radio.Button value={TABLE_SIZE.large}>Large</Radio.Button>
              </Radio.Group>
            </Space>
          </List.Item>
          {/* scroll */}
          <List.Item>
            <Space size="large">
              <strong>Scroll:</strong>
              <Radio.Group
                buttonStyle="solid"
                defaultValue={tableScroll}
                onChange={(e) => setTableScroll(e.target.value)}
              >
                <Radio.Button value={TABLE_SCROLL.fixed}>Fixed</Radio.Button>
                <Radio.Button value={TABLE_SCROLL.sticky}>Sticky</Radio.Button>
              </Radio.Group>
            </Space>
          </List.Item>
          {/* borders */}
          <List.Item>
            <Space size="large">
              <strong>Borders:</strong>
              <Switch defaultChecked={tableBorder} onChange={setTableBorder} />
            </Space>
          </List.Item>
          <List.Item>
            <strong className="w-25">Page Size:</strong>
            <Slider
              // tooltip={{ open: true }}
              className="w-75"
              step={25}
              marks={{ 250: "250", 150: "150", 50: "50" }}
              defaultValue={pageSize}
              min={50}
              max={250}
              onChange={setPageSize}
            />
          </List.Item>
          <List.Item>
            <Space size="large">
              <strong>Title Bar Placement:</strong>
              <Radio.Group
                buttonStyle="solid"
                defaultValue={paginationPlacement}
                onChange={(e) => setPaginationPlacement(e.target.value)}
              >
                <Radio.Button value={PAGINATION_PLACEMENT.topRight}>
                  Top
                </Radio.Button>
                <Radio.Button value={PAGINATION_PLACEMENT.bottomRight}>
                  Bottom
                </Radio.Button>
              </Radio.Group>
            </Space>
          </List.Item>
        </List>
      ),
    });
  };

  const renderTableFilters = () =>
    tableFilters.map((f) => (
      <Tag color="blue" key={f.title}>
        {f.title.toUpperCase()}(<strong>{displayData(f.value)}</strong>)
      </Tag>
    ));

  // eslint-disable-next-line react/prop-types
  function TableExtraActions(arg) {
    const range = arg?.range;
    const total = arg?.total;

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
              Showing <strong>{range[1]}</strong> out of{" "}
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
          <Button
            className="flex-centered"
            title="Table Configuration"
            icon={<CiSettings size={22} />}
            onClick={renderTableConfigurations}
          />

          {tableName && (
            <Button
              onClick={renderColumnCustomizer}
              title="Customize Column"
              icon={<BsTable size={15} />}
            />
          )}
        </Space>
      </div>
    );
  }

  const TableProps = {
    sticky: true,
    scroll: {
      x: "max-content",
      y: tableScroll === TABLE_SCROLL.fixed ? "73vh" : null,
    },
    onChange,
    showSorterTooltip: false,
    className: "container-fluid",
    size: tableSize,
    bordered: tableBorder,
    pagination: {
      position: [paginationPlacement],
      defaultPageSize: 100,
      // pageSizeOptions,
      pageSize,
      showSizeChanger: false,
      showTotal: (total, range) => TableExtraActions({ total, range }),
    },
    title: (currentPageData) =>
      !currentPageData.length && (
        <div className="py-3 w-100">{TableExtraActions()}</div>
      ),
  };

  return { TableProps, columnCustommize };
};

export default useTable;
