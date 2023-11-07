import {
  Button,
  Card,
  Descriptions,
  Image,
  Progress,
  Space,
  Tag,
  Typography,
} from "antd";
import PropTypes from "prop-types";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { GiTrophyCup } from "react-icons/gi";
import { IoMdHeartEmpty } from "react-icons/io";
import { CURRENCY } from "../../../../settings";
import { moneyWithCommas } from "../../../../utils";
import ShareCoin from "./ShareCoin";

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
        <div className="d-flex justify-content-between align-items-center">
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
            <div className="d-flex align-items-center w-25">
              {/* low */}
              <div
                className="d-flex align-items-center"
                style={{ fontSize: 12, flex: 1 }}
              >
                <span className="text-faint">Low 24h:</span>{" "}
                <strong>
                  {moneyWithCommas(data.market_data.low_24h.usd, CURRENCY)}
                </strong>
              </div>
              <Progress
                className="m-0"
                style={{ flex: 1.5 }}
                size="small"
                strokeColor="#c4bebe"
                status="active"
                percent={30}
                // eslint-disable-next-line react/no-unstable-nested-components
                format={() => (
                  <>
                    <span className="text-faint">High 24h:</span>{" "}
                    <strong>
                      {moneyWithCommas(data.market_data.high_24h.usd, CURRENCY)}
                    </strong>
                  </>
                )}
              />
            </div>

            {/* categories */}
            <div className="d-flex flex-column w-75">
              <strong>categories:</strong>
              <Space className="flex-wrap" size="small">
                {data.categories.map((category) => (
                  <Tag color="geekblue" key={category}>
                    {category}
                  </Tag>
                ))}
              </Space>
            </div>
          </Space>

          <Space direction="vertical" size="small" style={{ flex: 1 }}>
            <Descriptions title="Key Links" column={1}>
              <Descriptions.Item label="Website">Zhou Maomao</Descriptions.Item>
              <Descriptions.Item label="Blockchain">
                1810000000
              </Descriptions.Item>
              <Descriptions.Item label="Live">
                Hangzhou, Zhejiang
              </Descriptions.Item>
              <Descriptions.Item label="Remark">empty</Descriptions.Item>
              <Descriptions.Item label="Address">
                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </div>
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
