import React from "react";
import ReactDOM from "react-dom/client";
import FakeStore from "./fakestore";
import 'bootstrap/dist/css/bootstrap.min.css';



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <FakeStore />
  </React.StrictMode>
);