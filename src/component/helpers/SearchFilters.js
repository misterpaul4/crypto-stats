import { Input } from "antd";

const SearchFilters = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  placeholder,
  clearFilters,
  close,
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

