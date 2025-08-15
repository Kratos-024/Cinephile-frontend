import { useState } from "react";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MoviePage } from "./pages/MoviePage";
import { GenrePage } from "./pages/GenrePage";
import { UserProfile } from "./pages/UserProfile";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./Apps/store";
import { WatchListPage } from "./pages/WatchListPage";
import { SearchPage } from "./pages/SearchPage";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { LayoutWithMenu } from "./components/Layout";
import { FullTrendingPage } from "./pages/FullTrendingPage";
onIdTokenChanged(auth, async (user) => {
  if (user) {
    const token = await user.getIdToken();
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
});

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
                <LayoutWithMenu menu={menu} menuHandler={menuHandler}>
                  <HomePage menu={menu} menuHandler={menuHandler} />
                </LayoutWithMenu>
              }
            />
            <Route
              path="/profile/:userid/:username"
              element={
                <LayoutWithMenu menu={menu} menuHandler={menuHandler}>
                  <UserProfile menu={menu} menuHandler={menuHandler} />
                </LayoutWithMenu>
              }
            />
            <Route
              path="/WatchlistPage"
              element={
                <LayoutWithMenu menu={menu} menuHandler={menuHandler}>
                  <WatchListPage menu={menu} menuHandler={menuHandler} />
                </LayoutWithMenu>
              }
            />
            <Route
              path="/search/:title"
              element={
                <LayoutWithMenu menu={menu} menuHandler={menuHandler}>
                  <SearchPage menu={menu} menuHandler={menuHandler} />
                </LayoutWithMenu>
              }
            />
            <Route
              path="/movies/trending"
              element={
                <LayoutWithMenu menu={menu} menuHandler={menuHandler}>
                  <FullTrendingPage menu={menu} menuHandler={menuHandler} />
                </LayoutWithMenu>
              }
            />
            <Route path="/movie/:id/:title" element={<MoviePage />} />
            <Route path="/genres" element={<GenrePage />} />
          </Routes>
        </BrowserRouter>
      </Layout>
    </section>
  );
}

export default App;
