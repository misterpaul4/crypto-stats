import { useState } from "react";
import { getLs, LOCAL_STORAGE_KEYS } from "../../utils/localStorage";
import AddNewFavourite from "./component/AddNew";
import Favourites from "./component/Favourites";
import NoFavourites from "./component/NoFavourites";

const FavouritesPage = () => {
  const favourites = getLs(LOCAL_STORAGE_KEYS.favourites) || [];

  // 'add new' modal
  const [visibility, setVisibility] = useState(false);

  const onModalOpen = () => {
    setVisibility(true);
  };

  const onModalClose = () => {
    setVisibility(false);
  };

  return (
    <>
      <AddNewFavourite
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
