import SearchFilters from "../component/helpers/SearchFilters";
import { SearchOutlined } from "@ant-design/icons";
import { accessObjProperty } from "./object";
import { DEFAULT_PLACEHOLDER } from "../settings";
import NumberFilters from "../component/helpers/NumberFilters";

// dataIndex: string[] | string

export const getSearchFilters = ({
  dataIndex,
  placeholder = DEFAULT_PLACEHOLDER,
}) => ({
  filterDropdown: (props) => (
    <SearchFilters placeholder={placeholder} {...props} />
  ),
  filterIcon: (filtered) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value, record) => {
    const prop =
      typeof dataIndex === "string"
        ? record[dataIndex]
        : accessObjProperty(record, dataIndex);

    return prop.toLowerCase().includes(value.toLowerCase());
  },
});

export const getNumberFilters = ({
  dataIndex,
  placeholder = DEFAULT_PLACEHOLDER,
  suggestions,
}) => ({
  filterDropdown: (props) => (
    <NumberFilters
      suggestions={suggestions}
      placeholder={placeholder}
      {...props}
    />
  ),
  onFilter: ({ action, value }, record) => {
    const prop =
      typeof dataIndex === "string"
        ? record[dataIndex]
        : accessObjProperty(record, dataIndex);

    switch (action) {
      case numberFilterOptions["Equal to"]:
        return prop === value;
      case numberFilterOptions["Greater than"]:
        return prop > value;
      case numberFilterOptions["Greater than or equal to"]:
        return prop >= value;
      case numberFilterOptions["Less than"]:
        return prop < value;
      case numberFilterOptions["Less than or equal to"]:
        return prop <= value;

      default:
        return true;
    }
  },
});

export const numberFilterOptions = {
  "Equal to": "=",
  "Greater than": ">",
  "Greater than or equal to": ">=",
  "Less than": "<",
  "Less than or equal to": "<=",
};

const billion = 1000000000;
const million = 1000000;
const thousand = 1000;

export const numberFilterSuggestions = {
  percentage: [-25, -10, 0, 10, 25],
};

