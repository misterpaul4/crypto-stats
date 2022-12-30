import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { AiFillCloseCircle } from "react-icons/ai";

const SearchFilters = ({ setSelectedKeys, selectedKeys, confirm }) => {
  return (
    <Input.Search
      size="large"
      className="search-filter"
      placeholder="e.g bitcoin"
      value={selectedKeys[0]}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onSearch={() => confirm()}
    />
  );
};
export default SearchFilters;

