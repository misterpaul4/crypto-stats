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

  const handleDragStart = (e, item, source) => {
    e.dataTransfer.setData("item", item);
    e.dataTransfer.setData("source", source);
  };

  const handleDrop = (e, target) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("item");
    const source = e.dataTransfer.getData("source");

    // Update source list
    if (source === "visible") {
      setVisibleColumns((prev) => prev.filter((i) => i !== item));
    } else if (source === "hidden") {
      sethiddenColumns((prev) => prev.filter((i) => i !== item));
    }

    // Update target list
    if (target === "visible") {
      setVisibleColumns((prev) => [...prev, item]);
    } else if (target === "hidden") {
      sethiddenColumns((prev) => [...prev, item]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow drop
  };

  // return (
  //   <div style={{ display: "flex", gap: "16px" }}>
  //     {/* First List */}
  //     <div
  //       onDrop={(e) => handleDrop(e, "list1")}
  //       onDragOver={handleDragOver}
  //       style={{
  //         border: "2px dashed #ccc",
  //         padding: "16px",
  //         width: "200px",
  //         minHeight: "150px",
  //       }}
  //     >
  //       <h4>List 1</h4>
  //       {items1.map((item, index) => (
  //         <div
  //           // eslint-disable-next-line react/no-array-index-key
  //           key={index}
  //           draggable
  //           onDragStart={(e) => handleDragStart(e, item, "list1")}
  //           style={{
  //             margin: "8px 0",
  //             padding: "8px",
  //             backgroundColor: "#f0f0f0",
  //             borderRadius: "4px",
  //             cursor: "move",
  //           }}
  //         >
  //           {item}
  //         </div>
  //       ))}
  //     </div>

  //     {/* Second List */}
  //     <div
  //       onDrop={(e) => handleDrop(e, "list2")}
  //       onDragOver={handleDragOver}
  //       style={{
  //         border: "2px dashed #ccc",
  //         padding: "16px",
  //         width: "200px",
  //         minHeight: "150px",
  //       }}
  //     >
  //       <h4>List 2</h4>
  //       {items2.map((item, index) => (
  //         <div
  //           // eslint-disable-next-line react/no-array-index-key
  //           key={index}
  //           draggable
  //           onDragStart={(e) => handleDragStart(e, item, "list2")}
  //           style={{
  //             margin: "8px 0",
  //             padding: "8px",
  //             backgroundColor: "#f0f0f0",
  //             borderRadius: "4px",
  //             cursor: "move",
  //           }}
  //         >
  //           {item}
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );

  return (
    <div
      onDrop={(e) => handleDrop(e, "visible")}
      onDragOver={handleDragOver}
      style={{
        border: "2px dashed #ccc",
      }}
    >
      <div>
        <Typography.Title level={5}>Visible</Typography.Title>
        <Space className="d-flex flex-wrap">
          {visibleColumns.map((col) => (
            <Tag
              // closable={visibleColumns.length > 1}
              // onClose={() => {
              //   setVisibleColumns((current) =>
              //     current.filter((c) => c !== col)
              //   );
              //   sethiddenColumns((current) => [...current, col]);
              // }}
              draggable
              onDragStart={(e) => handleDragStart(e, col, "visible")}
              color="blue"
              key={col}
            >
              {col}
            </Tag>
          ))}
        </Space>
      </div>

      <hr className="mt-4" />

      <div
        onDrop={(e) => handleDrop(e, "hidden")}
        onDragOver={handleDragOver}
        style={{
          border: "2px dashed #ccc",
        }}
      >
        <Typography.Title level={5}>Hidden</Typography.Title>
        <Space className="d-flex flex-wrap">
          {hiddenColumns.map((col) => (
            <Tag
              // closable
              // onClose={() => {
              //   sethiddenColumns((current) =>
              //     current.filter((c) => c !== col)
              //   );
              //   setVisibleColumns((current) => [...current, col]);
              // }}
              draggable
              onDragStart={(e) => handleDragStart(e, col, "hidden")}
              color="red"
              key={col}
            >
              {col}
            </Tag>
          ))}
        </Space>
      </div>

      <Space
        className="justify-content-end d-flex mt-5"
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
