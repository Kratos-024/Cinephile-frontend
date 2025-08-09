import { useState } from "react";
import "./App.css";
import { Container } from "./components/Container";
import { Menu } from "./components/Menu";
import { HomePage } from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MoviePage } from "./pages/MoviePage";
import { GenrePage } from "./pages/GenrePage";
import { UserProfile } from "./pages/UserProfile";

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
          <Route path="/movie/:id/:title" element={<MoviePage />}></Route>
          <Route path="/genres" element={<GenrePage />}></Route>{" "}
          <Route
            path="/userprofile"
            element={
              <Container>
                <Menu menu={menu} />
                <UserProfile menu={menu} menuHandler={menuHandler} />{" "}
              </Container>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </section>
  );
}

export default App;
