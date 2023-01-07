import { Drawer } from "antd";

const DetailsDrawer = ({
  children,
  visibility,
  onClose,
  width = 700,
  title,
}) => {
  return (
    <Drawer
      title={title ?? null}
      width={width}
      destroyOnClose
      open={visibility}
      onClose={onClose}
    >
      {children}
    </Drawer>
  );
};

export default DetailsDrawer;

