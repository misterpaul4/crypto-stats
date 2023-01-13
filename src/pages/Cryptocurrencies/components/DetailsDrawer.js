/* eslint-disable react/prop-types */
import { Drawer } from "antd";

function DetailsDrawer({ children, visibility, onClose, width = 700, title }) {
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
}

export default DetailsDrawer;
