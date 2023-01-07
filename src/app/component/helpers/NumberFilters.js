import { Button, Form, InputNumber, Radio, Space } from "antd";
import { formatNumber, numberInputFormatter } from "../../utils";
import { numberFilterOptions } from "../../utils/filters";
import { AiFillFilter, AiOutlineClear } from "react-icons/ai";

const NumberFilters = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  placeholder,
  clearFilters,
  close,
  suggestions,
  title,
}) => {
  const labelProps = { span: 24, className: "font-weight-bold" };

  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    if (values.action && values.value !== undefined) {
      setSelectedKeys([{ ...values, title }]);
      confirm();
    }
  };

  const handleFilterClear = () => {
    clearFilters();
    form.resetFields();
    confirm();
  };

  return (
    <Form
      className="px-3 py-3 border"
      style={{ maxWidth: 300 }}
      onFinish={handleSubmit}
      initialValues={selectedKeys.length ? selectedKeys[0] : {}}
      form={form}
    >
      <Form.Item
        label="Action"
        labelCol={labelProps}
        rules={[{ required: true, message: "Please pick an action!" }]}
        name="action"
      >
        <Radio.Group className="d-flex flex-column">
          {Object.entries(numberFilterOptions).map(([label, value]) => (
            <Radio key={value} value={value}>
              {label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="value"
        label="Value"
        labelCol={labelProps}
        className="mb-3"
      >
        <InputNumber
          required
          size="large"
          className="w-100"
          formatter={numberInputFormatter}
          placeholder={placeholder}
        />
      </Form.Item>

      {suggestions && (
        <Space className="d-flex flex-wrap">
          {suggestions.map((v) => (
            <Button
              shape="round"
              type="dashed"
              key={v}
              onClick={() => form.setFieldValue("value", v)}
            >
              {formatNumber(v, "", 0)}
            </Button>
          ))}
        </Space>
      )}

      <div className="d-flex justify-content-between mt-5">
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
};

export default NumberFilters;

