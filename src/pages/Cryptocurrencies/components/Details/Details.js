import {
  Button,
  Card,
  Descriptions,
  Image,
  Progress,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import PropTypes from "prop-types";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { GiTrophyCup } from "react-icons/gi";
import { IoMdHeartEmpty } from "react-icons/io";
import { GoLinkExternal } from "react-icons/go";
import { CURRENCY } from "../../../../settings";
import { moneyWithCommas } from "../../../../utils";
import ShareCoin from "./ShareCoin";
import CardV from "./CardV";
import SentimentChart from "./SentimentChart";
import MoneyFormat from "../../../../app/component/helpers/MoneyFormat";

function isValidUrl(url) {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

const RenderLinks = (data) =>
  Object.entries(data)
    .map(([key, value]) => {
      if (!value) return null;
      let validUrl = false;
      let res = "";
      const mutiLinkArr = [];

      if (typeof value === "string") {
        validUrl = isValidUrl(value);
        res = value;
      } else if (Array.isArray(value)) {
        if (typeof value[0] === "string") {
          // eslint-disable-next-line prefer-destructuring
          res = value[0];
          validUrl = isValidUrl(value);

          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < value.length; i++) {
            // eslint-disable-next-line no-unused-expressions
            value[i] && isValidUrl(value[i]) && mutiLinkArr.push(value[i]);
          }
        }
      }

      if (!res) return null;

      const hasMultiLinks = mutiLinkArr.length > 1;
      const Title = key.replace(/_/g, " ");

      const Component = (
        <Tag
          bordered={false}
          style={{ textTransform: "capitalize" }}
          className={`rounded ${validUrl ? "cursor-pointer" : ""}`}
          key={key}
          onClick={() => validUrl && window.open(res, "_blank")}
        >
          {Title}
          {validUrl ? (
            <Typography.Link className="ml-1" target="_blank" href={res}>
              <GoLinkExternal size={15} />
            </Typography.Link>
          ) : (
            <Tag className="ml-2">
              <strong>
                <Typography.Text copyable>{res}</Typography.Text>
              </strong>
            </Tag>
          )}
        </Tag>
      );

      return hasMultiLinks ? (
        <Tooltip
          color="white"
          title={
            <div>
              <Typography.Title level={5}>{Title}</Typography.Title>
              <Space wrap>
                {mutiLinkArr.map((l) => (
                  <Typography.Link key={l} target="_blank" href={l}>
                    {l} <GoLinkExternal size={15} />
                  </Typography.Link>
                ))}
              </Space>
            </div>
          }
        >
          {Component}
        </Tooltip>
      ) : (
        Component
      );
    })
    .filter(Boolean);

function Details({ data, favourites, removeFromFavourites, addToFavourites }) {
  const { btnIcon, btnClick, btnTitle } = favourites.includes(data.id)
    ? {
        btnIcon: <FcLike size={20} />,
        btnClick: removeFromFavourites,
        btnTitle: "Remove from favourites",
      }
    : {
        btnIcon: <IoMdHeartEmpty size={22} />,
        btnClick: addToFavourites,
        btnTitle: "Add to favourites",
      };

  const { tagColor, tagIcon } =
    data.market_data.price_change_percentage_24h < 0
      ? { tagColor: "red", tagIcon: <AiFillCaretDown /> }
      : { tagColor: "green", tagIcon: <AiFillCaretUp /> };

  return (
    <div>
      <Card className="mt-3 shadow-sm">
        <div className="d-flex justify-content-between">
          <Space direction="vertical" size="small" style={{ flex: 1.5 }}>
            <div className="mb-2">
              <Tag
                icon={<GiTrophyCup className="mr-1" />}
                className="rounded d-inline-flex align-items-center"
              >
                Rank #{data.market_cap_rank}
              </Tag>
            </div>
            <Space>
              <Image width={60} src={data.image?.large} />
              <Typography.Title className="m-0" level={3}>
                {data.name}
              </Typography.Title>
              <Typography.Title className="text-faint m-0" level={4}>
                {data.symbol.toUpperCase()}
              </Typography.Title>
              <Button
                onClick={btnClick}
                shape="circle"
                className="ml-2 flex-centered shadow"
                type="dashed"
                icon={btnIcon}
                title={btnTitle}
              />
              <ShareCoin crypto={data} />
            </Space>

            <div className="mt-3 d-flex align-items-center">
              <Typography.Text
                className="text-black mr-2"
                style={{ fontSize: "2.2rem" }}
                strong
              >
                {moneyWithCommas(data.market_data.current_price.usd, CURRENCY)}
              </Typography.Text>
              <Tag
                color={tagColor}
                icon={tagIcon}
                className="p-1 flex-centered"
                style={{ fontSize: "1.2rem" }}
              >
                {Math.abs(data.market_data.price_change_percentage_24h)}
              </Tag>
            </div>

            {/* price change */}
            <div
              className="d-flex align-items-center w-75"
              style={{ fontSize: "0.8rem" }}
            >
              {/* low */}
              <span className="text-faint">Low 24h:</span>{" "}
              <strong className="mx-1">
                {moneyWithCommas(data.market_data.low_24h.usd, CURRENCY)}
              </strong>
              <Progress
                className="m-0"
                style={{ flex: 1.5 }}
                size="small"
                strokeColor="#c4bebe"
                status="active"
                percent={30}
                // eslint-disable-next-line react/no-unstable-nested-components
                format={() => (
                  <div style={{ fontSize: "0.8rem" }}>
                    <span className="text-faint">High 24h:</span>{" "}
                    <strong>
                      {moneyWithCommas(data.market_data.high_24h.usd, CURRENCY)}
                    </strong>
                  </div>
                )}
              />
            </div>

            {/* categories */}
            <div className="d-flex flex-column w-75 mt-3">
              <Space className="flex-wrap" size="small">
                {data.categories.map((category) => (
                  <Tag color="geekblue" key={category}>
                    {category}
                  </Tag>
                ))}
              </Space>
            </div>
          </Space>

          <div className="d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex">
              <CardV
                title="Market cap"
                value={data.market_data.market_cap.usd}
                percentageChange={
                  data.market_data.market_cap_change_percentage_24h
                }
              />
            </div>
            <SentimentChart
              target={data.sentiment_votes_up_percentage}
              title="Community Sentiment"
            />
          </div>
        </div>
      </Card>

      <Card className="mt-3 shadow-sm">
        <Descriptions column={3}>
          <Descriptions.Item label="Market supply">
            {moneyWithCommas(data.market_data.max_supply)}
          </Descriptions.Item>
          <Descriptions.Item label="Fully diluted market cap">
            <MoneyFormat
              amount={data.market_data.fully_diluted_valuation.usd}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Total volume">
            <MoneyFormat amount={data.market_data.total_volume.usd} />
          </Descriptions.Item>
          <Descriptions.Item label="Circulating supply">
            {moneyWithCommas(data.market_data.circulating_supply)}
          </Descriptions.Item>
        </Descriptions>
        <Space className="mt-5 d-flex flex-wrap">
          {RenderLinks(data.links)}
        </Space>
      </Card>

      <Card className="mt-3 shadow-sm text-muted">
        <div dangerouslySetInnerHTML={{ __html: data.description.en }} />
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
