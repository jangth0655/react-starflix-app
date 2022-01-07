import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./router/Home";
import Search from "./router/Search";
import Tv from "./router/Tv";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/movies/:movieId"} element={<Home />} />
        <Route path={"/tv/now/:tvId"} element={<Tv />} />
        <Route path={"/tv/popular/:tvName"} element={<Tv />} />
        <Route path={"/tv"} element={<Tv />} />
        <Route path={"/search"} element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
