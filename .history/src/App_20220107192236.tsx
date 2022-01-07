import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./router/Home";
import Search from "./router/Search";
import Tv from "./router/Tv";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path={`${process.env.PUBLIC_URL}/`} element={<Home />} />
        <Route
          path={`${process.env.PUBLIC_URL}/movies/:movieId`}
          element={<Home />}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/tv/now/:tvId`}
          element={<Tv />}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/tv/popular/:tvName`}
          element={<Tv />}
        />
        <Route path={`${process.env.PUBLIC_URL}/tv`} element={<Tv />} />
        <Route path={`${process.env.PUBLIC_URL}/search`} element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
