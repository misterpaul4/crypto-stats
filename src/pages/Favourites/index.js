import { useState } from "react";
import useLazyAPI from "../../app/hooks/useLazyAPI";
import { ALL_TOKENS } from "../../endpoints";
import { getLs, LOCAL_STORAGE_KEYS } from "../../utils/localStorage";
import AddNewFavourite from "./component/AddNew";
import Favourites from "./component/Favourites";
import NoFavourites from "./component/NoFavourites";
import "../../css/favourite.css";

const FavouritesPage = () => {
  const favourites = getLs(LOCAL_STORAGE_KEYS.favourites) || [];

  const [getCoins, { loading, data }] = useLazyAPI({ url: ALL_TOKENS });

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

  return (
    <>
      <AddNewFavourite
        loading={loading}
        data={data}
        onClose={onModalClose}
        visibility={visibility}
        favourites={favourites}
      />
      {favourites.length ? (
        <Favourites favourites={favourites} />
      ) : (
        <NoFavourites addNew={onModalOpen} />
      )}
    </>
  );
};

export default FavouritesPage;
