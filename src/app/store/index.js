import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import { getSagas } from "./sagas";

import { reducer } from "./reducer";

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(
  reducer,
  applyMiddleware(createLogger(), sagaMiddleware)
);

export function initStore(apiClient) {
  getSagas(apiClient).forEach((saga) => {
    sagaMiddleware.run(saga);
  });

  return store;
}
