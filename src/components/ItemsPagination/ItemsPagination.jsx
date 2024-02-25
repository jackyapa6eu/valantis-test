import { observer } from "mobx-react";
import { Pagination } from "antd";
import { useMemo } from "react";
import { dataStore } from "../../stores/dataStore";

const ItemsPagination = observer(({ disabled }) => {
  const {
    currentPage,
    setCurrentPage,
    totalItems,
    pageSize,
    onShowSizeChange,
    pageSizeOptions,
    selectedFilters,
  } = dataStore;

  const isFiltered = useMemo(
    () => Object.keys(selectedFilters).length > 0,
    [selectedFilters],
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        boxShadow: "0 0 5px #d7d7d7",
        paddingTop: "6px",
      }}
    >
      <Pagination
        onShowSizeChange={onShowSizeChange}
        current={currentPage}
        onChange={setCurrentPage}
        pageSize={pageSize}
        total={isFiltered ? 0 : totalItems}
        pageSizeOptions={pageSizeOptions}
        responsive
        style={{
          textAlign: "center",
        }}
        disabled={disabled}
      />
    </div>
  );
});

export default ItemsPagination;
