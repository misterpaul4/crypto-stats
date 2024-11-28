/* eslint-disable import/no-extraneous-dependencies */
import { Gauge } from "@ant-design/plots";

function SentimentChart({ target, total = 100, title }) {
  const config = {
    width: 300,
    height: 300,
    autoFit: true,
    data: {
      target,
      total,
      name: "score",
    },
    style: {
      textContent: () => null,
    },
    scale: {
      color: {
        range: ["green", "red"],
      },
    },
  };
  return (
    <div className="text-center text-muted position-relative">
      <Gauge {...config} />
      <span className="sentiment-chart-label">{title}</span>
    </div>
  );
}

export default SentimentChart;
