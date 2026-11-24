import { all } from "redux-saga/effects";
import { WatchFetchGetUsers } from "./UserSaga/fetchUsersSaga";
import { WatchFetchRegisterUser } from "./UserSaga/fetchRegisterUserSaga";
import { WatchFetchLoginUser } from "./UserSaga/fetchLoginUser";
import { WatchFetchUserById } from "./UserSaga/fetchUserById";

export default function* RootSaga() {
  yield all([
    WatchFetchGetUsers(),
    WatchFetchRegisterUser(),
    WatchFetchLoginUser(),
    WatchFetchUserById()
  ]);
}
