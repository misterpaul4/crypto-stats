/* eslint-disable react/prop-types */
import { Tag } from "antd";

function YesNoTagged({ condition, reverse = false }) {
  const { color, label } =
    condition && !reverse
      ? { label: "Yes", color: "green" }
      : { label: "No", color: "red" };

  return typeof condition === "boolean" ? (
    <Tag color={color}>{label}</Tag>
  ) : (
    "-"
  );
}

export default YesNoTagged;
