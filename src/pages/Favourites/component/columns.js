import { Button } from "antd";
import { FcDislike } from "react-icons/fc";
import { removeFromFavourites } from "../../../app/helpers/localStorageActions";
import { removeSucesss } from "../../../app/helpers/message";
import { commonColumns } from "../../Cryptocurrencies/component/columns";

const columns = () => [
  ...commonColumns,
  {
    title: "Action",
    fixed: "right",
    render: (data) => (
      <Button
        type="text"
        onClick={() => {
          removeFromFavourites([data.id]);
          removeSucesss(data.symbol);
        }}
      >
        <FcDislike className="mr-2" /> Remove
        <strong className="mx-1">{data.symbol.toUpperCase()}</strong>
      </Button>
    ),
  },
];

export default columns;
