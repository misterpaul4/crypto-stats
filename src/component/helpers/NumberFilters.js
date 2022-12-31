import { Button, Form, InputNumber, Radio } from "antd";
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
}) => {
  const labelProps = { span: 24, className: "font-weight-bold" };

  const handleSubmit = (values) => {
    if (values.action && values.value !== undefined) {
      setSelectedKeys([values]);
      confirm();
    }
  };

  const handleFilterClear = () => {
    clearFilters();
    confirm();
  };

  return (
    <Form
      className="px-3 py-3 border"
      onFinish={handleSubmit}
      initialValues={selectedKeys.length ? selectedKeys[0] : {}}
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
      <Form.Item name="value" label="Value" labelCol={labelProps}>
        <InputNumber
          required
          size="large"
          className="w-100"
          formatter={numberInputFormatter}
          placeholder={placeholder}
        />
      </Form.Item>

      <div className="d-flex justify-content-end">
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

