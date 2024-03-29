/* eslint-disable import/no-cycle */
/* eslint-disable react/prop-types */
import { Button, DatePicker, Form, Radio, Switch } from "antd";
import { AiFillFilter, AiOutlineClear } from "react-icons/ai";
import { useState } from "react";
import {
  dateFilterOptions,
  dateRangeFilterOptions,
} from "../../../../utils/filters";
import {
  labelProps,
  pickerOptionsFormat,
  rangeNames,
  singleDateNames,
} from "./constants";

const { RangePicker } = DatePicker;

const sharedDateLabelProps = {
  label: "Date",
  labelCol: labelProps,
  rules: [{ required: true, message: "Please pick a date!" }],
};

function DateFilter({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  close,
  title,
  picker,
}) {
  const [form] = Form.useForm();

  const [isRange, setIsRange] = useState(false);

  const RangeComp = (
    <Form.Item {...sharedDateLabelProps} name={rangeNames.date}>
      <RangePicker
        picker={picker}
        format={(value) =>
          value.format(pickerOptionsFormat[picker] ?? pickerOptionsFormat.date)
        }
      />
    </Form.Item>
  );

  const SingleDayComp = (
    <Form.Item {...sharedDateLabelProps} name={singleDateNames.date}>
      <DatePicker
        picker={picker}
        size="large"
        className="w-100"
        format={(value) =>
          value.format(pickerOptionsFormat[picker] ?? pickerOptionsFormat.date)
        }
      />
    </Form.Item>
  );

  const config = isRange
    ? {
        dateComp: RangeComp,
        tableValue: rangeNames.date,
        actionOptions: dateRangeFilterOptions,
        actionName: rangeNames.action,
      }
    : {
        dateComp: SingleDayComp,
        tableValue: singleDateNames.date,
        actionOptions: dateFilterOptions,
        actionName: singleDateNames.action,
      };

  const handleFilterClear = () => {
    clearFilters();
    const { action, date } = isRange ? rangeNames : singleDateNames;
    form.setFieldsValue({ [action]: undefined, [date]: undefined });
    confirm();
  };

  const handleSubmit = (values) => {
    setSelectedKeys([
      { ...values, isRange, title, value: values[config.tableValue] },
    ]);
    confirm();
  };

  return (
    <Form
      className="p-3 border"
      style={{ width: 320 }}
      onFinish={handleSubmit}
      form={form}
      // initialValues={selectedKeys.length ? selectedKeys[0] : {}}
    >
      <Form.Item className="d-flex align-items-center">
        <Switch
          checked={isRange}
          onClick={setIsRange}
          className="mr-2"
          size="small"
        />
        Date Range
      </Form.Item>

      <Form.Item
        label="Action"
        labelCol={labelProps}
        name={config.actionName}
        rules={[{ required: true, message: "Please pick an action!" }]}
      >
        <Radio.Group className="d-flex flex-column">
          {Object.entries(config.actionOptions).map(([label, value]) => (
            <Radio key={value} value={value}>
              {label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      {config.dateComp}

      <div className="d-flex justify-content-between mt-4">
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

export default DateFilter;
