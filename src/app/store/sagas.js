import { take, put, select } from "redux-saga/effects";
import uuid from "uuid";

import { history } from "./history";
import * as mutations from "./mutations";

export function getSagas(apiClient) {
  function* taskCreationSaga() {
    while (true) {
      const { groupID } = yield take(mutations.REQUEST_TASK_CREATION);
      const ownerID = yield select((state) => state.session.id);
      const taskID = uuid();
      let mutation = mutations.createTask(taskID, groupID, ownerID);
      const { res } = yield apiClient.post(`/task/new`, {
        task: {
          id: taskID,
          group: groupID,
          owner: ownerID,
          isComplete: false,
          name: "New task",
        },
      });
      yield put(mutation);
    }
  }

  function* commentCreationSaga() {
    while (true) {
      const comment = yield take(mutations.ADD_TASK_COMMENT);
      apiClient.post(`/comment/new`, { comment });
    }
  }

  function* taskModificationSaga() {
    while (true) {
      const task = yield take([
        mutations.SET_TASK_GROUP,
        mutations.SET_TASK_NAME,
        mutations.SET_TASK_COMPLETE,
      ]);
      apiClient.post(`/task/update`, {
        task: {
          id: task.taskID,
          group: task.groupID,
          name: task.name,
          isComplete: task.isComplete,
        },
      });
    }
  }

  function* userAuthenticationSaga() {
    while (true) {
      const { username, password } = yield take(
        mutations.REQUEST_AUTHENTICATE_USER
      );
      try {
        console.log("h===========before====");

        const { data } = yield apiClient.post(`/authenticate`, {
          username,
          password,
        });
        console.log("h===============", data);
        yield put(mutations.setState(data.state));
        yield put(
          mutations.processAuthenticateUser(mutations.AUTHENTICATED, {
            id: "U1", // todo... get ID from response
            token: data.token,
          })
        );
        history.push(`/dashboard`);
      } catch (e) {
        /* catch block handles failed login */
        yield put(
          mutations.processAuthenticateUser(mutations.NOT_AUTHENTICATED)
        );
      }
    }
  }

  function* userAccountCreationSaga() {
    while (true) {
      const { username, password } = yield take(
        mutations.REQUEST_USER_ACCOUNT_CREATION
      );
      try {
        const { data } = yield apiClient.post(`/user/create`, {
          username,
          password,
        });
        console.log(data);

        yield put(
          mutations.setState({ ...data.state, session: { id: data.userID } })
        );
        yield put(mutations.processAuthenticateUser(mutations.AUTHENTICATED));

        history.push("/dashboard");
      } catch (e) {
        console.error("Error", e);
        yield put(
          mutations.processAuthenticateUser(mutations.USERNAME_RESERVED)
        );
      }
    }
  }

  return [
    taskCreationSaga,
    commentCreationSaga,
    taskModificationSaga,
    userAuthenticationSaga,
    userAccountCreationSaga,
  ];
}
