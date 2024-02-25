import "./App.css";
import { useEffect } from "react";
import { observer } from "mobx-react";
import { dataStore } from "./stores/dataStore";
import Logo from "./assets/Logo";
import Items from "./components/Items";

const App = observer(() => {
  const { getTotalItems, getFilterOptions } = dataStore;

  useEffect(() => {
    (async () => {
      await getTotalItems();
    })();
    (async () => {
      await getFilterOptions();
    })();
  }, []);
  return (
    <div className="App">
      <header className="header">
        <Logo />
      </header>
      <main className="main-content">
        <Items />
      </main>
    </div>
  );
});

export default App;
