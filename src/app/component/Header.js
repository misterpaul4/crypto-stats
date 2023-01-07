import React from "react";
import { Link } from "react-router-dom";
import "../../css/header.css";
import { Button, Input, Space } from "antd";
import { FcLike } from "react-icons/fc";
import { PATHS } from "../../paths";

const Header = () => (
  <header className="py-2 px-5">
    <Link to="/">
      <div className="logo bg-img" />
    </Link>

    <Space size="large">
      <Link to="/">
        <Button type="text">Cryptocurrencies</Button>
      </Link>
      <Link to="/">
        <Button type="text">Exchanges</Button>
      </Link>
    </Space>

    <Space size="large">
      <Link to={PATHS.favourites}>
        <Button icon={<FcLike className="mr-2" />} type="text">
          Favourites
        </Button>
      </Link>
      <Input.Search allowClear placeholder="Search" />
    </Space>
  </header>
);

export default Header;
