import { Tag } from "antd";

const YesNoTagged = ({ condition, reverse = false }) => {
  const { color, label } =
    condition && !reverse
      ? { label: "Yes", color: "green" }
      : { label: "No", color: "red" };

  return typeof condition === "boolean" ? (
    <Tag color={color}>{label}</Tag>
  ) : (
    "-"
  );
};

export default YesNoTagged;
