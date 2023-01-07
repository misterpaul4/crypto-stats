import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const PageLoader = ({ children, loading }) => (
  <Spin
    className="page-loader"
    tip="...Loading"
    spinning={loading}
    indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
  >
    {children}
  </Spin>
);

export default PageLoader;

