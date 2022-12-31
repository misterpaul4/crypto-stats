import { Button, Form, InputNumber, Radio, Space } from "antd";
import { numberInputFormatter } from "../../utils";
import { numberFilterOptions } from "../../utils/filters";
import { AiFillFilter, AiOutlineClear } from "react-icons/ai";
import { useRef } from "react";

const NumberFilters = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  placeholder,
  clearFilters,
  close,
  suggestions,
}) => {
  const labelProps = { span: 24, className: "font-weight-bold" };

  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    if (values.action && values.value !== undefined) {
      setSelectedKeys([values]);
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
        className="mb-2"
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
        <Space>
          {suggestions.map((v) => (
            <Button
              shape="round"
              type="dashed"
              key={v}
              onClick={() => form.setFieldValue("value", v)}
            >
              {v}
            </Button>
          ))}
        </Space>
      )}

      <div className="d-flex justify-content-end mt-4">
        <Button
          className="d-flex align-items-center"
          icon={<AiOutlineClear className="mr-1" />}
          onClick={handleFilterClear}
        >
          Clear
        </Button>
        <Button
          htmlType="submit"
          type="primary"
          className="ml-2 d-flex align-items-center"
          icon={<AiFillFilter className="mr-1" />}
        >
          Filter
        </Button>
      </div>
    </Form>
  );
};

export default NumberFilters;

