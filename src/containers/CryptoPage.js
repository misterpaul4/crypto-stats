/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/cryptoPage.css';

const CryptoPage = () => {
  const currentPath = useLocation().pathname;
  const cryptoID = currentPath.replace('/cryptostat/', '');

  const [cryptoData, updateCrypto] = useState(null);

  useEffect(() => {
    const url = `https://api.coingecko.com/api/v3/coins/${cryptoID}?localization=false&tickers=false&market_data=true&community_data=false`;

    fetch(url).then(response => response.json())
      .then(data => {
        updateCrypto(data);
        // console.log(data.description.en);
      });

    return null;
  }, []);

  // const InsertDescription = () => {
  //   const stuff = 'asd';
  //   // const doc = document.createElement('span');
  //   // doc.insertAdjacentHTML('afterend', '<div>what i inserted</div>');
  //   // console.log(doc);
  //   return (
  //     <span>
  //       something
  //     </span>
  //   );
  // };

  return (
    <div className="container c-pg py-4">
      {
        cryptoData
          ? (
            <>
              <div className="d-flex align-items-center">
                <img src={cryptoData.image.large} alt="crypto icon" className="mr-4 c-pg-icon" />
                <h1 className="c-pg-title">{cryptoData.name}</h1>
              </div>

              <div className="py-4 c-pg-statistics">
                <h4>Key Statistics</h4>
                <div className="c-pg-stats-grid">
                  <div>
                    <span className="c-pg-stats-name">Current Price: </span>
                    {cryptoData.market_data.current_price.usd}
                  </div>

                  <div>
                    <span className="c-pg-stats-name">Market Cap: </span>
                    {cryptoData.market_data.market_cap.usd}
                  </div>

                  <div>
                    <span className="c-pg-stats-name">Price Change(30days): </span>
                    {cryptoData.market_data.price_change_percentage_30d}
                    %
                  </div>

                  <div>
                    <span className="c-pg-stats-name">Price Change(1year): </span>
                    {cryptoData.market_data.price_change_percentage_1y}
                    %
                  </div>

                  <div>
                    <span className="c-pg-stats-name">All Time High: </span>
                    {cryptoData.market_data.ath.usd}
                  </div>

                  <div>
                    <span className="c-pg-stats-name">Total Supply: </span>
                    {cryptoData.market_data.total_supply}
                  </div>
                </div>
              </div>

              <div className="py-4 c-pg-details">
                <h4>To Know</h4>
                <div className="c-pg-stats-grid">
                  <div>
                    <span className="c-pg-stats-name">Symbol: </span>
                    {cryptoData.symbol}
                  </div>

                  {
                    cryptoData.genesis_date
                      ? (
                        <div>
                          <span className="c-pg-stats-name">Creation Date: </span>
                          {cryptoData.genesis_date}
                        </div>
                      )
                      : ''
                  }
                </div>
              </div>
            </>
          )
          : <span>...loading</span>
      }
    </div>
  );
};

export default CryptoPage;
