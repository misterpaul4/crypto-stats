import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { AiFillCloseCircle } from "react-icons/ai";

const SearchFilters = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  placeholder = "Type here...",
}) => {
  return (
    <Input.Search
      size="large"
      className="search-filter"
      placeholder={placeholder}
      value={selectedKeys[0]}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onSearch={() => confirm()}
    />
  );
};
export default SearchFilters;

