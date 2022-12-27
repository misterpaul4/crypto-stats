import { Descriptions, Space, Tag, Typography } from "antd";
import useAPI from "../hooks/useAPI";
import { CRYPTO_DETAILS } from "../settings";
import { dateFormat } from "../utils";
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
          <Descriptions layout="vertical" bordered title="Basic Info">
            <Item label="Symbol">{d.symbol}</Item>
            <Item label="Name">{d.name}</Item>
            <Item label="Hashing Algorithm">{d.hashing_algorithm}</Item>
            <Item label="Categories">
              {d.categories.map((dt) => (
                <Tag className="m-1" color="geekblue">
                  {dt}
                </Tag>
              ))}
            </Item>
            <Item label="Country of Origin">{d.country_origin}</Item>
            <Item label="Creation Date">{dateFormat(d.genesis_date)}</Item>
            <Item label="Market Cap Rank"># {d.market_cap_rank}</Item>
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

