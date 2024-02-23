import { observer } from "mobx-react";
import { LoadingOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { dataStore } from "../../stores/dataStore";
import ItemsPagination from "../ItemsPagination";
import Item from "../Item/Item";
import "./index.css";

const Items = observer(() => {
  const [timer, setTimer] = useState(3);
  const { itemsArr, getItemsData, loadingState } = dataStore;

  const isLoading = useMemo(() => loadingState === "loading", [loadingState]);
  const isError = useMemo(() => loadingState === "error", [loadingState]);

  const handleTimer = useCallback((secs) => {
    let seconds = secs ?? 3;
    setTimeout(async () => {
      seconds -= 1;
      setTimer(seconds);
      if (seconds === 0) {
        await getItemsData();
        setTimer(3);
      } else handleTimer(seconds);
    }, 1000);
  }, []);

  useEffect(() => {
    (async () => {
      await getItemsData();
    })();
  }, []);

  useEffect(() => {
    if (isError) handleTimer();
  }, [isError]);

  return (
    <div className="items-main-container">
      <div className="items-notifications">
        {isLoading && <LoadingOutlined style={{ fontSize: "40px" }} />}
        {isError && (
          <article>
            <p>При получении данных произошла ошибка.</p>
            <p>
              Повторный запрос произойдет через: <span>{timer}</span>
            </p>
          </article>
        )}
      </div>
      <div className="items-container">
        {itemsArr.map((element) => (
          <Item key={element.id} data={element} />
        ))}
      </div>

      <ItemsPagination disabled={isLoading || isError} />
    </div>
  );
});

export default Items;
