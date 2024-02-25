import { observer } from "mobx-react";
import { useEffect, useMemo } from "react";
import { dataStore } from "../../stores/dataStore";
import ItemsPagination from "../ItemsPagination";
import Item from "../Item";
import "./index.css";
import ItemsFilters from "../ItemsFilters";
import ItemsNotifications from "../ItemsNotifications";

const Items = observer(() => {
  const { itemsArr, filteredItemsArr, getData, loadingState, selectedFilters } =
    dataStore;

  const isLoading = useMemo(() => loadingState === "loading", [loadingState]);
  const isError = useMemo(() => loadingState === "error", [loadingState]);

  const isFiltered = useMemo(
    () => Object.keys(selectedFilters).length > 0,
    [selectedFilters],
  );

  const isNothingFound = useMemo(
    () =>
      loadingState === "done" && isFiltered && filteredItemsArr.length === 0,
    [loadingState, isFiltered, filteredItemsArr],
  );

  const data = useMemo(
    () => (isFiltered ? filteredItemsArr : itemsArr),
    [isFiltered, filteredItemsArr, itemsArr],
  );

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  return (
    <div className="items-main-container">
      <ItemsFilters isLoading={isLoading} isFiltered={isFiltered} />
      <div className="items-container">
        {(isLoading || isError || isNothingFound) && (
          <ItemsNotifications
            isLoading={isLoading}
            isError={isError}
            isNothingFound={isNothingFound}
          />
        )}
        {data.map((element) => (
          <Item key={element.id} data={element} />
        ))}
      </div>
      <ItemsPagination disabled={isLoading || isError} />
    </div>
  );
});

export default Items;
