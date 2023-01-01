import SearchFilters from "../component/helpers/SearchFilters";
import { SearchOutlined } from "@ant-design/icons";
import { accessObjProperty } from "./object";
import { DEFAULT_PLACEHOLDER } from "../settings";
import NumberFilters from "../component/helpers/NumberFilters";
import DateFilter from "../component/helpers/DateFilter";
import {
  rangeNames,
  singleDateNames,
} from "../component/helpers/DateFilter/constants";
import moment from "moment";

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

    if (typeof prop === "number") {
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
          return false;
      }
    }

    return false;
  },
});

export const getDateFilters = ({ dataIndex }) => ({
  filterDropdown: (props) => <DateFilter {...props} />,
  onFilter: (values, record) => {
    const prop =
      typeof dataIndex === "string"
        ? record[dataIndex]
        : accessObjProperty(record, dataIndex);

    if (prop) {
      if (values.isRange) {
        const { action, date } = rangeNames;

        const date1 = new Date(values[date][0].toISOString().split("T")[0]);
        const date2 = new Date(values[date][1].toISOString().split("T")[0]);
        const date3 = new Date(prop.split("T")[0]);

        const startDate = date1.getTime();
        const endDate = date2.getTime();
        const propDate = date3.getTime();

        switch (values[action]) {
          case dateRangeFilterOptions["Date Between"]:
            return propDate >= startDate && propDate <= endDate;
          case dateRangeFilterOptions["Date Not Between"]:
            return propDate <= startDate && propDate <= endDate;

          default:
            return false;
        }
      } else {
        const { action, date } = singleDateNames;
        const date1 = new Date(values[date].toISOString().split("T")[0]);
        const date2 = new Date(prop.split("T")[0]);

        const value = date1.getTime();
        const propDate = date2.getTime();

        switch (values[action]) {
          case dateFilterOptions["Date After"]:
            return propDate > value;
          case dateFilterOptions["Date Before"]:
            return propDate < value;
          case dateFilterOptions["Selected Date"]:
            return propDate === value;
          case dateFilterOptions["Selected Date & Date After"]:
            return propDate >= value;
          case dateFilterOptions["Selected Date & Date Before"]:
            return propDate <= value;

          default:
            return false;
        }
      }
    }

    return false;
  },
});

export const numberFilterOptions = {
  "Equal to": "=",
  "Greater than": ">",
  "Greater than or equal to": ">=",
  "Less than": "<",
  "Less than or equal to": "<=",
};

export const dateFilterOptions = {
  "Selected Date": "=",
  "Date Before": "<",
  "Selected Date & Date Before": "<=",
  "Date After": ">",
  "Selected Date & Date After": ">=",
};

export const dateRangeFilterOptions = {
  "Date Between": "bw",
  "Date Not Between": "nbw",
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

