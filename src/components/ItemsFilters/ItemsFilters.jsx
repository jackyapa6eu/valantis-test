import { observer } from "mobx-react";
import { Button, Input, Select } from "antd";
import { useMemo } from "react";
import { dataStore } from "../../stores/dataStore";
import "./index.css";

const ItemsFilters = observer(({ isLoading, isFiltered }) => {
  const {
    filterOptions,
    setFilters,
    selectedFilters,
    handleSelectFilter,
    getFilterOptionsLoadingState,
  } = dataStore;

  const isSelectLoading = useMemo(
    () => getFilterOptionsLoadingState === "loading",
    [getFilterOptionsLoadingState],
  );

  const priceFilterOptions = useMemo(
    () => filterOptions.price ?? [],
    [filterOptions],
  );
  const brandFilterOptions = useMemo(
    () => filterOptions.brand ?? [],
    [filterOptions],
  );

  const handleFilter = async () => {
    setFilters();
  };

  const handleSearch = (input, option) =>
    (option?.value.toString() ?? "")
      .toLowerCase()
      .includes(input.toLowerCase());

  return (
    <div className="items-selects">
      <Input
        title="название"
        placeholder="название"
        allowClear
        onChange={(value) => handleSelectFilter(value, "product")}
        value={selectedFilters.product}
        disabled={isLoading}
      />
      <Select
        value={selectedFilters.price}
        options={priceFilterOptions}
        title="цена"
        placeholder="цена"
        onChange={(value) => setFilters(value, "price")}
        filterOption={handleSearch}
        disabled={isLoading}
        loading={isSelectLoading}
        showSearch
        allowClear
      />
      <Select
        value={selectedFilters.brand}
        options={brandFilterOptions}
        title="бренд"
        placeholder="бренд"
        onChange={(value) => setFilters(value, "brand")}
        filterOption={handleSearch}
        disabled={isLoading}
        loading={isSelectLoading}
        showSearch
        allowClear
      />
      {isFiltered && (
        <Button onClick={handleFilter} disabled={!isFiltered || isLoading}>
          Очистить фильтр
        </Button>
      )}
    </div>
  );
});

export default ItemsFilters;
