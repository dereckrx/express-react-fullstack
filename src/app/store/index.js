import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import { getSagas } from "./sagas";

import { reducer } from "./reducer";

export function initStore(apiClient) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    reducer,
    applyMiddleware(createLogger(), sagaMiddleware)
  );

  getSagas(apiClient).forEach((saga) => {
    sagaMiddleware.run(saga);
  });

  return store;
}
