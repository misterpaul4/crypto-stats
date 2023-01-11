import React, { useState } from "react";
import PropTypes from "prop-types";
import { Avatar, Table as ATable, Typography } from "antd";
import columns from "./columns";
import DetailsDrawer from "./DetailsDrawer";
import CryptoDetails from "./CryptoDetails";
import PageLoader from "../../../app/component/PageLoader";
import useTable from "../../../app/hooks/useTable";
import useLocalStorage from "../../../app/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import { FAVOURITE_ACTIONS } from "../utils/constants";

function App({ cryptos, loading, refetch }) {
  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState();

  const [favourites, setFavourites] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.favourites,
    fallback: [],
  });

  const onFavouriteUpdate = (cryptoId, action) => {
    switch (action) {
      case FAVOURITE_ACTIONS.add:
        setFavourites([...favourites, cryptoId]);
        break;

      case FAVOURITE_ACTIONS.remove:
        setFavourites(favourites.filter((fv) => fv !== cryptoId));
        break;

      default:
        break;
    }
  };

  const { TableProps } = useTable({ loading, refetch });

  const onDetailsClose = () => {
    setDrawerVisibility(false);
    setSelectedCrypto(undefined);
  };

  const onDetailsOpen = (crypto) => {
    setDrawerVisibility(true);
    setSelectedCrypto(crypto);
  };

  return (
    <PageLoader loading={!cryptos}>
      <DetailsDrawer
        title={
          <Typography.Title level={3}>
            <Avatar size="small" src={selectedCrypto?.image} />{" "}
            {selectedCrypto?.name}
          </Typography.Title>
        }
        width="80%"
        onClose={onDetailsClose}
        visibility={drawerVisibility}
      >
        <CryptoDetails id={selectedCrypto?.id} />
      </DetailsDrawer>
      <div className="container-fluid px-4">
        {cryptos && (
          <ATable
            {...TableProps}
            columns={columns({ onDetailsOpen, favourites, onFavouriteUpdate })}
            rowKey={(d) => d.id}
            dataSource={cryptos || []}
          />
        )}
      </div>
    </PageLoader>
  );
}

App.defaultProps = {
  cryptos: undefined,
};

App.propTypes = {
  refetch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  cryptos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
};

export default App;
