/* eslint-disable react/prop-types */
import { Button, Form, Input } from "antd";
import { AiFillFilter, AiOutlineClear } from "react-icons/ai";

function SearchFilters({
  setSelectedKeys,
  selectedKeys,
  confirm,
  placeholder,
  clearFilters,
  close,
  title,
}) {
  const [form] = Form.useForm();

  const handleFilterClear = () => {
    clearFilters();
    form.resetFields();
    confirm();
  };

  const handleSubmit = (values) => {
    if (values.searchTerm) {
      setSelectedKeys([
        {
          value: values.searchTerm,
          title,
        },
      ]);
      confirm();
    } else {
      setSelectedKeys([]);
    }
  };

  return (
    <Form
      className="p-3 border"
      style={{ minWidth: 300 }}
      onFinish={handleSubmit}
      initialValues={selectedKeys.length ? selectedKeys[0] : {}}
      form={form}
    >
      <Form.Item name="searchTerm">
        <Input
          size="large"
          className="search-filter"
          placeholder={placeholder}
          required
          allowClear
        />
      </Form.Item>

      <div className="d-flex justify-content-between mt-2">
        <Button size="small" type="text" onClick={() => close()}>
          Close
        </Button>
        <div className="d-flex">
          <Button
            size="small"
            className="d-flex align-items-center"
            icon={<AiOutlineClear className="mr-1" />}
            onClick={handleFilterClear}
          >
            Clear
          </Button>
          <Button
            size="small"
            htmlType="submit"
            type="primary"
            className="ml-2 d-flex align-items-center"
            icon={<AiFillFilter className="mr-1" />}
          >
            Filter
          </Button>
        </div>
      </div>
    </Form>
  );
}
export default SearchFilters;
