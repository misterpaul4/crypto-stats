import { Descriptions, Space, Tag, Typography } from "antd";
import useAPI from "../hooks/useAPI";
import { CRYPTO_DETAILS } from "../settings";
import { dateFormat, moneyWithCommas } from "../utils";
import PageLoader from "./PageLoader";
import { GoLinkExternal } from "react-icons/go";

const { Item } = Descriptions;

const CryptoDetails = ({ id }) => {
  const [d, { loading }] = useAPI({ url: CRYPTO_DETAILS(id) });

  const extLink = <GoLinkExternal size={20} />;

  const renderLinks = (links) =>
    links.map(
      (l) =>
        l.link && (
          <Item label={l.label} key={l.label}>
            <Typography.Link target="_blank" href={l.link}>
              {extLink}
            </Typography.Link>
          </Item>
        )
    );

  return (
    <PageLoader loading={loading}>
      {d && (
        <Space direction="vertical" size="large" className="w-100">
          <Descriptions column={2} bordered title="Basic Info">
            <Item label="Symbol">{d.symbol?.toUpperCase()}</Item>
            <Item label="Name">{d.name}</Item>
            <Item label="Hashing Algorithm">{d.hashing_algorithm}</Item>

            <Item label="Country of Origin">{d.country_origin}</Item>
            <Item label="Creation Date">{dateFormat(d.genesis_date)}</Item>
            <Item label="Market Cap Rank"># {d.market_cap_rank}</Item>
            <Item label="Categories">
              {d.categories.map((dt) => (
                <Tag key={dt} className="m-1" color="geekblue">
                  {dt}
                </Tag>
              ))}
            </Item>
          </Descriptions>

          <Descriptions column={2} bordered title="Market Data">
            <Item label="Current Price">
              {moneyWithCommas(d.market_data.current_price.usd, "$")}
            </Item>

            <Item label="Market Cap">
              {moneyWithCommas(d.market_data.market_cap.usd, "$")}
            </Item>

            <Item label="24H High" className="text-success">
              {moneyWithCommas(d.market_data.high_24h.usd, "$")}
            </Item>

            <Item label="24H Low" className="text-danger">
              {moneyWithCommas(d.market_data.low_24h.usd, "$")}
            </Item>

            <Item label="All Time High" className="text-success">
              {moneyWithCommas(d.market_data.ath.usd, "$")}
            </Item>
            <Item label="All Time High Date">
              <Tag color="green">{dateFormat(d.market_data.ath_date.usd)}</Tag>
            </Item>
            <Item label="All Time Low" className="text-danger">
              {moneyWithCommas(d.market_data.atl.usd, "$")}
            </Item>
            <Item label="All Time High Date">
              <Tag color="red">{dateFormat(d.market_data.atl_date.usd)}</Tag>
            </Item>
            <Item label="Circulating Supply">
              {moneyWithCommas(d.market_data.circulating_supply)}
            </Item>
            <Item label="Total Supply">
              {moneyWithCommas(d.market_data.total_supply)}
            </Item>
            <Item label="Fully Diluted Valuation">
              {moneyWithCommas(d.market_data.fully_diluted_valuation.usd, "$")}
            </Item>
          </Descriptions>

          <Descriptions column={2} bordered title="Links">
            {renderLinks([
              { label: "Hompage", link: d.links.homepage[0] },
              { label: "Blockchain Link", link: d.links.blockchain_site[0] },
              { label: "Official Forum", link: d.links.official_forum_url[0] },
              { label: "Subreddit", link: d.links.subreddit_url },
              {
                label: "Twitter",
                link:
                  d.links.twitter_screen_name &&
                  "//twitter.com/" + d.links.twitter_screen_name,
              },
            ])}
          </Descriptions>
        </Space>
      )}
    </PageLoader>
  );
};

export default CryptoDetails;

