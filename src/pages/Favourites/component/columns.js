import { Button } from "antd";
import { useContext } from "react";
import { FcDislike } from "react-icons/fc";
import { removeSucesss } from "../../../app/helpers/message";
import { commonColumns } from "../../Cryptocurrencies/component/columns";
import { FavouriteContext } from "../context/favouriteContext";

const columns = () => {
  const { onFavouriteUpdate, favourites } = useContext(FavouriteContext);

  return [
    ...commonColumns,
    {
      title: "Action",
      fixed: "right",
      render: (data) => (
        <Button
          type="text"
          onClick={() => {
            onFavouriteUpdate(favourites.filter((id) => id !== data.id));
            removeSucesss(data.symbol);
          }}
        >
          <FcDislike className="mr-2" /> Remove
          <strong className="mx-1">{data.symbol.toUpperCase()}</strong>
        </Button>
      ),
    },
  ];
};

export default columns;
