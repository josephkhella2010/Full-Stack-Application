import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./reduxSaga/rootSaga";
import UserSliceReducer from "./reduxSlices/userSlice/UserSlice";
import LoadingErrorReducer from "./reduxSlices/LoadingSlice/LoadingAndErrorSlice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    userSlice: UserSliceReducer,
    loadingErrorSlice: LoadingErrorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
