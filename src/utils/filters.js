import SearchFilters from "../component/helpers/SearchFilters";
import { SearchOutlined } from "@ant-design/icons";
import { accessObjProperty } from "./object";

// dataIndex: string[] | string
export const getSearchFilters = ({ dataIndex, placeholder }) => ({
  filterDropdown: (props) => (
    <SearchFilters placeholder={placeholder} {...props} />
  ),
  filterIcon: (filtered) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value, record) =>
    typeof dataIndex === "string"
      ? record[dataIndex].toLowerCase().includes(value.toLowerCase())
      : accessObjProperty(record, dataIndex)
          .toLowerCase()
          .includes(value.toLowerCase()),
});

