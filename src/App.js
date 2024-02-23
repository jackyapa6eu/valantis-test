import "./App.css";
import { useEffect } from "react";
import { observer } from "mobx-react";
import { dataStore } from "./stores/dataStore";
import Items from "./features/Items";
import Logo from "./assets/Logo";

const App = observer(() => {
  const { getTotalItems } = dataStore;

  useEffect(() => {
    (async () => {
      await getTotalItems();
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
