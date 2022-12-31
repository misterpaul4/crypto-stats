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

export const numberFilterSuggestions = {
  percentage: [-25, -10, -5, 0, 5, 10, 25],
  price: [0.0001, 0.01, 1, 5, 100, 1000, 10000],
  supply: [10000, 100000, 1000000, 10000000, 1000000000, 1000000000000],
  cap: [
    100000000, 500000000, 1000000000, 5000000000, 20000000000, 50000000000,
    100000000000,
  ],
};

