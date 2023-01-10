import { Avatar, Button, Input, List, Modal, Typography } from "antd";
import { useEffect, useState } from "react";
import { FcLike } from "react-icons/fc";

const AddNewFavourite = ({
  favourites,
  visibility,
  onClose,
  loading,
  data,
}) => {
  const [selectedCoins, setSelectedCoins] = useState([]);
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

  return (
    <Modal
      centered
      cancelButtonProps={{ className: "d-none" }}
      okButtonProps={{ disabled: !selectedCoins.length }}
      title={
        <div>
          <Typography.Title className="text-center" level={3}>
            Add Coins {!!selectedCoins.length && `[${selectedCoins.length}]`}
          </Typography.Title>

          <Input
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            allowClear
            className="mt-2"
          />
        </div>
      }
      okText="Add Selected"
      open={visibility}
      onCancel={onClose}
    >
      <List
        loading={loading}
        className="add-favourite-list"
        dataSource={filteredData}
        renderItem={(coin) => (
          <List.Item>
            <div>
              <Avatar size="small" src={coin.image} className="ml-1 mr-2" />
              <strong>{coin.name}</strong>
              <span className="ml-1 text-muted">
                {coin.symbol.toUpperCase()}
              </span>
            </div>
            <Button
              className="flex-centered"
              type="text"
              icon={<FcLike />}
            ></Button>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default AddNewFavourite;
