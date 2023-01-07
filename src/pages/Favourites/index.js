import { getLs, LOCAL_STORAGE_KEYS } from "../../utils/localStorage";
import Favourites from "./component/Favourites";
import NoFavourites from "./component/NoFavourites";

const FavouritesPage = () => {
  const favourites = getLs(LOCAL_STORAGE_KEYS.favourites);

  return favourites ? <Favourites favourites={favourites} /> : <NoFavourites />;
};

export default FavouritesPage;
