import { useState } from "react";
import "./App.css";
import { Container } from "./components/Container";
import { Menu } from "./components/Menu";
import { HomePage } from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MoviePage } from "./pages/MoviePage";
import { GenrePage } from "./pages/GenrePage";

function App() {
  const [menu, setMenu] = useState<boolean>(true);
  const menuHandler = () => {
    setMenu(!menu);
  };
  return (
    <section className="">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Container>
                <Menu menu={menu} />
                <HomePage menu={menu} menuHandler={menuHandler} />
              </Container>
            }
          ></Route>
          <Route path="/movie" element={<MoviePage />}></Route>
          <Route path="/genres" element={<GenrePage />}></Route>
        </Routes>
      </BrowserRouter>
    </section>
  );
}

export default App;
