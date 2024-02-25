import { observer } from "mobx-react";
import { LoadingOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import "./index.css";
import { dataStore } from "../../stores/dataStore";

const ItemsNotifications = observer(
  ({ isLoading, isError, isNothingFound }) => {
    const [timer, setTimer] = useState(3);
    const { getData } = dataStore;
    const handleTimer = useCallback((secs) => {
      let seconds = secs ?? 3;
      setTimeout(async () => {
        seconds -= 1;
        setTimer(seconds);
        if (seconds === 0) {
          await getData();
          setTimer(3);
        } else handleTimer(seconds);
      }, 1000);
    }, []);

    useEffect(() => {
      if (isError) handleTimer();
    }, [isError]);

    return (
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
        {isNothingFound && (
          <article>
            <p>По вашему запросу ничего не найдено.</p>
          </article>
        )}
      </div>
    );
  },
);

export default ItemsNotifications;
