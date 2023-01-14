import React, { useState } from "react";
import PropTypes from "prop-types";
import { Avatar, Table as ATable, Typography } from "antd";
import { FcLike } from "react-icons/fc";
import { IoMdHeartEmpty } from "react-icons/io";
import columns from "./columns";
import DetailsDrawer from "./DetailsDrawer";
import CryptoDetails from "./CryptoDetails";
import PageLoader from "../../../app/component/PageLoader";
import useTable from "../../../app/hooks/useTable";
import useLocalStorage from "../../../app/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import { addSuccess, removeSucesss } from "../../../app/helpers/message";

function App({ cryptos, loading, refetch }) {
  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState();

  const [favourites, setFavourites] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.favourites,
    fallback: [],
  });

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
            columns={columns(onDetailsOpen)}
            rowKey={(d) => d.id}
            className="main-crypto-table"
            dataSource={Array.isArray(cryptos) ? cryptos : []}
            rowSelection={{
              hideSelectAll: true,
              selectedRowKeys: favourites,
              renderCell: (checked, record) =>
                checked ? (
                  <FcLike
                    className="cursor-pointer"
                    onClick={() => {
                      setFavourites(
                        favourites.filter((fav) => fav !== record.id)
                      );
                      removeSucesss(record.symbol);
                    }}
                  />
                ) : (
                  <IoMdHeartEmpty
                    size={16}
                    className="cursor-pointer"
                    onClick={() => {
                      setFavourites([...favourites, record.id]);
                      addSuccess(record.symbol);
                    }}
                  />
                ),
            }}
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
