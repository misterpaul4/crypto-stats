import useAPI from "../../../app/hooks/useAPI";
import { FAVOURITE_TOKENS } from "../../../endpoints";
import FavouritesTable from "./Table";

const Favourites = ({ favourites }) => {
  const [data, { loading, refetch }] = useAPI({
    url: FAVOURITE_TOKENS(favourites),
  });

  return <FavouritesTable data={data} loading={loading} refetch={refetch} />;
};

export default Favourites;
