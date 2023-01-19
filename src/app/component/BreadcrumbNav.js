import { useHistory } from "react-router-dom";
import { Breadcrumb } from "antd";
import { FiHome } from "react-icons/fi";

function BreadcrmbNav({ routes = [] }) {
  const navigate = useHistory();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">
        <FiHome />
      </Breadcrumb.Item>
      {routes.map((route) => (
        <Breadcrumb.Item
          key={route.label}
          onClick={() => route.path && navigate.push(route.path)}
        >
          {route.icon}
          {route.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}

export default BreadcrmbNav;
