import { useLocation } from "react-router-dom";
import BreadcrmbNav from "../../../../app/component/BreadcrumbNav";
import PageLoader from "../../../../app/component/PageLoader";
import { addSuccess, removeSucesss } from "../../../../app/helpers/message";
import useAPI from "../../../../app/hooks/useAPI";
import useLocalStorage from "../../../../app/hooks/useLocalStorage";
import { CRYPTO_DETAILS } from "../../../../endpoints";
import { LOCAL_STORAGE_KEYS } from "../../../../utils/localStorage";
import Details from "./Details";

function CryptoDetails() {
  const [, id] = useLocation().pathname.split("/cryptocurrency/");
  const [data, { loading }] = useAPI({ url: CRYPTO_DETAILS(id) });

  const [favourites, setFavourites] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.favourites,
    fallback: [],
  });

  const addToFavourites = () => {
    setFavourites([...favourites, data.id]);
    addSuccess(data.symbol);
  };

  const removeFromFavourites = () => {
    setFavourites(favourites.filter((coinId) => coinId !== data.id));
    removeSucesss(data.symbol);
  };

  return (
    <div className="container mt-3">
      <PageLoader loading={loading}>
        <BreadcrmbNav
          routes={[
            {
              label: data?.name || "-",
            },
          ]}
        />
        {data && (
          <Details
            addToFavourites={addToFavourites}
            removeFromFavourites={removeFromFavourites}
            favourites={favourites}
            data={data}
          />
        )}
      </PageLoader>
    </div>
  );
}

export default CryptoDetails;
