import { getLs, LOCAL_STORAGE_KEYS } from "../../utils/localStorage";
import NoFavourites from "./component/NoFavourites";

const FavouritesPage = () => {
  const favourites = getLs(LOCAL_STORAGE_KEYS.favourites);

  return favourites ? <p>favourites</p> : <NoFavourites />;
};

export default FavouritesPage;
