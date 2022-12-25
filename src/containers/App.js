import React, { useEffect } from "react";
import propTypes from "prop-types";
import { connect } from "react-redux";
import { updateCryptos } from "../actions";
import HotToday from "./HotToday";
import Filter from "./Filter";
import Table from "./CryptoTable";
import PageLoader from "../component/PageLoader";
import { Table as ATable } from "antd";
import columns from "../component/Columns";

const App = ({ cryptos, updateCryptosState }) => {
  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false&price_change_percentage=24h%2C7d";

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        updateCryptosState(data);
      });

    return null;
  }, []);

  return (
    <PageLoader loading={!cryptos}>
      <div className="main-container container">
        {cryptos && (
          <>
            <HotToday />
            <ATable
              sticky
              columns={columns()}
              rowKey={(d) => d.id}
              dataSource={cryptos?.cryptos || []}
              scroll={{ x: "auto", y: 500 }}
            />
            {/* <Filter /> */}
            {/* <Table /> */}
          </>
        )}
      </div>
    </PageLoader>
  );
};

const mapStateToProps = (state) => ({
  cryptos: state.cryptos,
});

const mapDispatchToProps = (dispatch) => ({
  updateCryptosState: (cryptos) => {
    dispatch(updateCryptos(cryptos));
  },
});

App.propTypes = {
  cryptos: propTypes.shape(
    propTypes.arrayOf({
      cryptos: propTypes.object,
    }).isRequired
  ),

  updateCryptosState: propTypes.func.isRequired,
};

App.defaultProps = {
  cryptos: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

