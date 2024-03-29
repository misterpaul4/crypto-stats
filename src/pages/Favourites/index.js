import { useEffect, useMemo, useState } from "react";
import useLazyAPI from "../../app/hooks/useLazyAPI";
import { ALL_TOKENS, FAVOURITE_TOKENS } from "../../endpoints";
import { LOCAL_STORAGE_KEYS } from "../../utils/localStorage";
import AddNewFavourite from "./component/AddNew";
import NoFavourites from "./component/NoFavourites";
import "../../css/favourite.css";
import FavouriteContext from "./context/favouriteContext";
import FavouritesTable from "./component/Table";
import useLocalStorage from "../../app/hooks/useLocalStorage";

function FavouritesPage() {
  // const favourites = getLs(LOCAL_STORAGE_KEYS.favourites) || [];

  const [favourites, setFavourites] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.favourites,
    fallback: [],
  });

  // all coins for adding and removing
  const [getCoins, { loading, data }] = useLazyAPI({ url: ALL_TOKENS });

  // favourited coins only
  const [
    getFavouriteCoins,
    { loading: favouritesLoading, data: favouriteCoins },
  ] = useLazyAPI({ url: FAVOURITE_TOKENS(favourites) });

  useEffect(() => {
    getFavouriteCoins();
  }, []);

  // 'add new' modal
  const [visibility, setVisibility] = useState(false);

  const onModalOpen = () => {
    if (!data) {
      getCoins();
    }
    setVisibility(true);
  };

  const onModalClose = () => {
    setVisibility(false);
  };

  const onFavouriteUpdate = (ids) => {
    setFavourites(ids);
    getFavouriteCoins(FAVOURITE_TOKENS(ids));
  };

  const contextValues = useMemo(
    () => ({ favourites, onFavouriteUpdate }),
    [favourites]
  );

  const refetch = () => getFavouriteCoins(FAVOURITE_TOKENS(favourites));

  return (
    <FavouriteContext.Provider value={contextValues}>
      <AddNewFavourite
        loading={loading}
        data={data}
        onClose={onModalClose}
        visibility={visibility}
      />
      {favourites.length ? (
        <FavouritesTable
          addNew={onModalOpen}
          data={favouriteCoins}
          refetch={refetch}
          loading={favouritesLoading}
        />
      ) : (
        <NoFavourites addNew={onModalOpen} />
      )}
    </FavouriteContext.Provider>
  );
}

export default FavouritesPage;
