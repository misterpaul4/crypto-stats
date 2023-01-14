import { DatePicker, Form } from "antd";

const { RangePicker } = DatePicker;

export const labelProps = { span: 24, className: "font-weight-bold" };

const sharedDateLabelProps = {
  label: "Date",
  labelCol: labelProps,
  rules: [{ required: true, message: "Please pick a date!" }],
};

export const rangeNames = {
  date: "range",
  action: "rangeAction",
};

export const singleDateNames = {
  date: "date",
  action: "action",
};

export const RangeComp = (
  <Form.Item {...sharedDateLabelProps} name={rangeNames.date}>
    <RangePicker format={(value) => value.format("MMM Do, YYYY")} />
  </Form.Item>
);

export const SingleDayComp = (
  <Form.Item {...sharedDateLabelProps} name={singleDateNames.date}>
    <DatePicker
      size="large"
      className="w-100"
      format={(value) => value.format("MMM Do, YYYY")}
    />
  </Form.Item>
);
