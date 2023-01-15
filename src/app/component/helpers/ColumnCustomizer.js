/* eslint-disable react/prop-types */
import { Button, Space, Tag, Typography } from "antd";
import { useState } from "react";

function ColumnCustomizer({
  onFinish,
  visible,
  hidden,
  defaultHiddenColumns,
  defaultVisibleColumns,
}) {
  const [visibleColumns, setVisibleColumns] = useState(visible);
  const [hiddenColumns, sethiddenColumns] = useState(hidden);

  return (
    <div>
      <div>
        <Typography.Title level={5}>Visible</Typography.Title>
        <Space className="d-flex flex-wrap">
          {visibleColumns.map((col) => (
            <Tag
              closable={visibleColumns.length > 1}
              onClose={() => {
                setVisibleColumns((current) =>
                  current.filter((c) => c !== col)
                );
                sethiddenColumns((current) => [...current, col]);
              }}
              color="blue"
              key={col}
            >
              {col}
            </Tag>
          ))}
        </Space>
      </div>

      {!!hiddenColumns.length && (
        <>
          <hr className="mt-4" />

          <div>
            <Typography.Title level={5}>Hidden</Typography.Title>
            <Space className="d-flex flex-wrap">
              {hiddenColumns.map((col) => (
                <Tag
                  closable
                  onClose={() => {
                    sethiddenColumns((current) =>
                      current.filter((c) => c !== col)
                    );
                    setVisibleColumns((current) => [...current, col]);
                  }}
                  color="red"
                  key={col}
                >
                  {col}
                </Tag>
              ))}
            </Space>
          </div>
        </>
      )}

      <Space
        className="justify-content-end d-flex mt-5"
        style={{ marginRight: -25, marginBottom: -10 }}
      >
        <Button
          onClick={() => {
            setVisibleColumns(defaultVisibleColumns);
            sethiddenColumns(defaultHiddenColumns);
          }}
        >
          Reset
        </Button>

        <Button
          onClick={() => onFinish(visibleColumns, hiddenColumns)}
          type="primary"
        >
          Save
        </Button>
      </Space>
    </div>
  );
}

export default ColumnCustomizer;
