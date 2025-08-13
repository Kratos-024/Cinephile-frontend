import { useState } from "react";
import "./App.css";
import { Container } from "./components/Container";
import { Menu } from "./components/Menu";
import { HomePage } from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MoviePage } from "./pages/MoviePage";
import { GenrePage } from "./pages/GenrePage";
import { UserProfile } from "./pages/UserProfile";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./Apps/store";

function Layout({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
function App() {
  const [menu, setMenu] = useState<boolean>(true);
  const menuHandler = () => {
    setMenu(!menu);
  };
  return (
    <section className="">
      <ToastContainer />
      <Layout>
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
              path="/userprofile/myprofile"
              element={
                <Container>
                  <Menu menu={menu} />
                  <UserProfile menu={menu} menuHandler={menuHandler} />{" "}
                </Container>
              }
            ></Route>
            <Route
              path="/profile/:userid/:username"
              element={
                <Container>
                  <Menu menu={menu} />
                  <UserProfile menu={menu} menuHandler={menuHandler} />{" "}
                </Container>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      </Layout>
    </section>
  );
}

export default App;
