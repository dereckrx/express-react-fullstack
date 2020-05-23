import React from "react";
import ReactDOM from "react-dom";
import { Main } from "./components/Main";

import { initStore } from "./store";
import { ApiClient } from "./store/apiClient";
import { history } from "./store/history";

const url =
  process.env.NODE_ENV === "production" ? `` : `http://localhost:7777`;

const apiClient = ApiClient(url);
const store = initStore(apiClient);

const props = { store, history };

ReactDOM.render(<Main {...props} />, document.getElementById("app"));
