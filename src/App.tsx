import { useState } from "react";
import "./App.css";
import { Container } from "./components/Container";
import { Menu } from "./components/Menu";
import { HomePage } from "./pages/HomePage";

function App() {
  const [menu, setMenu] = useState<boolean>(true);
  const menuHandler = () => {
    setMenu(!menu);
  };
  return (
    <section className=" h-screen relative w-full bg-primary">
      <Container>
        <Menu menu={menu} />
        <HomePage menu={menu} menuHandler={menuHandler} />
      </Container>
    </section>
  );
}

export default App;
