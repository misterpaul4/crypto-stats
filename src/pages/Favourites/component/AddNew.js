import { Modal } from "antd";

const AddNewFavourite = ({ favourites, visibility, onClose }) => {
  return (
    <Modal open={visibility} onCancel={onClose}>
      modal content
    </Modal>
  );
};

export default AddNewFavourite;
