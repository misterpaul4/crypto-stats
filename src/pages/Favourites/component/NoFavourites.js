import PropTypes from "prop-types";
import { Button, Result } from "antd";

function NoFavourites({ addNew }) {
  return (
    <Result
      className="mt-5"
      status="404"
      title="Empty"
      subTitle="You have not favourited any coin on this browser"
      extra={
        <Button onClick={addNew} type="primary">
          Add Coins
        </Button>
      }
    />
  );
}

NoFavourites.propTypes = {
  addNew: PropTypes.func.isRequired,
};

export default NoFavourites;
