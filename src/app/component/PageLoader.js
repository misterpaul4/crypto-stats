/* eslint-disable import/no-extraneous-dependencies */
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// eslint-disable-next-line react/prop-types
function PageLoader({ children, loading }) {
  return (
    <Spin
      className="page-loader"
      tip="...Loading"
      spinning={loading}
      indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
    >
      {children}
    </Spin>
  );
}

export default PageLoader;
