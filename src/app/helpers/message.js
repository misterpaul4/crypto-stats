import { message } from "antd";

export const addSuccess = (symbol) =>
  message.success({
    content: (
      <span>
        <strong>{symbol}</strong> added to favourites
      </span>
    ),
  });

export const removeSucesss = (symbol) =>
  message.warning({
    content: (
      <span>
        <strong>{symbol}</strong> removed from favourites
      </span>
    ),
  });
