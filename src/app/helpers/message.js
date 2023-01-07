import { message } from "antd";

export const addSuccess = (symbol) =>
  message.success({
    content: (
      <span>
        <strong>{symbol}</strong> added
      </span>
    ),
  });

export const removeSucesss = (symbol) =>
  message.warning({
    content: (
      <span>
        <strong>{symbol}</strong> removed
      </span>
    ),
  });
