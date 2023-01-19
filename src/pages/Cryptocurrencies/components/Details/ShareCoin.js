import { Button, Image, Input, message, Modal, Space, Typography } from "antd";
import { useState } from "react";
import { BsHeartFill } from "react-icons/bs";
import { FiCopy, FiShare } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { getBasePath } from "../../../../app/helpers/paths";
import { PATHS } from "../../../../paths";
import { BASE_URL } from "../../../../settings";

function ShareCoin({ crypto }) {
  const [visibility, setVisibility] = useState(false);

  const onClose = () => setVisibility(false);

  const path = useLocation().pathname;

  return (
    <>
      <Modal
        cancelButtonProps={{ className: "d-none" }}
        okButtonProps={{ className: "d-none" }}
        onCancel={onClose}
        open={visibility}
        className="flex-centered text-center"
      >
        <Space direction="vertical" className="py-4">
          <Image
            className="shadow mb-5"
            width={150}
            src={crypto.image.large}
            preview={false}
          />
          <Typography.Title level={2}>
            Share
            <span className="text-muted mx-2">
              {crypto.symbol.toUpperCase()}
            </span>
            link with friends
          </Typography.Title>
          <Typography.Text
            className="text-muted"
            style={{ fontSize: "0.9rem" }}
            copyable={{
              icon: <FiCopy size={30} />,
              tooltips: false,
              onCopy: () => {
                message.info("Copied to your clipboard");
                setTimeout(() => {
                  onClose();
                }, 1000);
              },
            }}
          >
            {`${getBasePath()}${PATHS.cryptoDetails(crypto.id)}`}
          </Typography.Text>
        </Space>
      </Modal>
      <Button
        onClick={() => setVisibility(true)}
        icon={<FiShare size={18} />}
        className="shadow flex-centered"
        shape="circle"
        type="dashed"
      />
    </>
  );
}

export default ShareCoin;
