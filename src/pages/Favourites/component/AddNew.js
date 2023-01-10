import { Avatar, Checkbox, Input, List, Modal, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { setLS, LOCAL_STORAGE_KEYS } from "../../../utils/localStorage";
import { FavouriteContext } from "../context/favouriteContext";

const AddNewFavourite = ({ visibility, onClose, loading, data }) => {
  const { favourites, onFavouriteUpdate } = useContext(FavouriteContext);

  const [favouritedCoins, setFavouritedCoins] = useState(favourites);
  const [filteredData, setFilteredData] = useState(data || []);

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      const filteredResult = data.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filteredResult);
    } else {
      setFilteredData(data);
    }
  };

  const handleUpdate = () => {
    onFavouriteUpdate(favouritedCoins);
    onClose();
  };

  return (
    <Modal
      className="favourite-modal"
      centered
      cancelButtonProps={{ className: "d-none" }}
      okButtonProps={{ disabled: !favouritedCoins.length }}
      title={
        <div>
          <Typography.Title className="text-center" level={3}>
            Add Coins
          </Typography.Title>

          <Input
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            allowClear
            className="mt-2"
          />
        </div>
      }
      okText="Update List"
      open={visibility}
      onCancel={onClose}
      onOk={handleUpdate}
    >
      <List
        loading={loading}
        className="add-favourite-list mt-3"
        dataSource={filteredData}
        renderItem={(coin) => {
          const actionProps = favouritedCoins.includes(coin.id)
            ? {
                checked: true,
                bg: "bg-light",
                onClick: () =>
                  setFavouritedCoins((current) =>
                    current.filter((id) => id !== coin.id)
                  ),
              }
            : {
                checked: false,
                bg: "bg-white",
                onClick: () =>
                  setFavouritedCoins((current) => [...current, coin.id]),
              };

          return (
            <List.Item
              className={`cursor-pointer ${actionProps.bg}`}
              onClick={actionProps.onClick}
            >
              <div>
                <Avatar size="small" src={coin.image} className="ml-1 mr-2" />
                <strong>{coin.name}</strong>
                <span className="ml-1 text-muted">
                  {coin.symbol.toUpperCase()}
                </span>
              </div>
              <Checkbox checked={actionProps.checked}></Checkbox>
            </List.Item>
          );
        }}
      />
    </Modal>
  );
};

export default AddNewFavourite;
