import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage by default
import { combineReducers } from "redux";

import usersReducer from "../Features/cruiseSlice";
import postReducer from "../Features/bookingSlice";

// Redux Persist config
const persistConfig = {
  key: "reduxstore",
  storage,
};

// Combine all reducers
const rootReducer = combineReducers({
  users: usersReducer,
  posts: postReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//Correct declaration of store
const store = configureStore({
  reducer: persistedReducer,
});

// Export both store and persistore (not "persistore" – fix spelling if needed)
const persistor = persistStore(store);

export { store, persistor };
