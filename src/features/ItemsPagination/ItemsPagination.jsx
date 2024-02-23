import { observer } from "mobx-react";
import { Pagination } from "antd";
import { dataStore } from "../../stores/dataStore";

const ItemsPagination = observer(({ disabled }) => {
  const {
    currentPage,
    setCurrentPage,
    totalItems,
    pageSize,
    onShowSizeChange,
    pageSizeOptions,
  } = dataStore;

  return (
    <Pagination
      onShowSizeChange={onShowSizeChange}
      current={currentPage}
      onChange={setCurrentPage}
      pageSize={pageSize}
      total={totalItems}
      pageSizeOptions={pageSizeOptions}
      responsive
      style={{ textAlign: "center", boxShadow: "0 0 5px #d7d7d7" }}
      hideOnSinglePage
      disabled={disabled}
    />
  );
});

export default ItemsPagination;
