import { Avatar, Button, Card, Space, Tag, Typography } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { BsShare } from "react-icons/bs";
import { FcLike } from "react-icons/fc";
import { FiShare } from "react-icons/fi";
import { GiTrophyCup } from "react-icons/gi";
import { IoMdHeartEmpty } from "react-icons/io";
import { CURRENCY } from "../../../../settings";
import { moneyWithCommas } from "../../../../utils";
import ShareCoin from "./ShareCoin";

function Details({ data, favourites, removeFromFavourites, addToFavourites }) {
  const { btnIcon, btnClick } = favourites.includes(data.id)
    ? { btnIcon: <FcLike size={20} />, btnClick: removeFromFavourites }
    : { btnIcon: <IoMdHeartEmpty size={22} />, btnClick: addToFavourites };

  return (
    <div>
      <Card className="mt-3 shadow-sm">
        <Space direction="vertical">
          <div className="mb-2">
            <Tag
              icon={<GiTrophyCup className="mr-1" />}
              className="rounded d-inline-flex align-items-center"
            >
              Rank #{data.market_cap_rank}
            </Tag>
          </div>
          <Space>
            <Avatar size="large" src={data.image?.large} />
            <Typography.Title className="m-0" level={3}>
              {data.name}
            </Typography.Title>
            <Typography.Title className="text-muted m-0" level={4}>
              {data.symbol.toUpperCase()}
            </Typography.Title>
            <Button
              onClick={btnClick}
              shape="circle"
              className="ml-2 flex-centered shadow"
              type="dashed"
              icon={btnIcon}
            />
            <ShareCoin crypto={data} />
          </Space>

          <div className="mt-3">
            <Typography.Text
              className="text-black"
              style={{ fontSize: "2.5rem" }}
              strong
            >
              {moneyWithCommas(data.market_data.current_price.usd, CURRENCY)}
            </Typography.Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}

Details.defaultProps = {
  data: {},
  favourites: [],
};

Details.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    market_cap_rank: PropTypes.number,
    symbol: PropTypes.string,
    image: PropTypes.shape({
      large: PropTypes.string,
    }),
    description: PropTypes.shape({
      en: PropTypes.string,
    }),
  }),
  favourites: PropTypes.arrayOf(PropTypes.string),
  addToFavourites: PropTypes.func.isRequired,
  removeFromFavourites: PropTypes.func.isRequired,
};

export default Details;
