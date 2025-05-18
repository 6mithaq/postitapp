import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';
import reportWebVitals from './reportWebVitals';


import { store, persistor } from './Store/store'; 
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react'; //Needed for redux-persist

function loader(source) {

  return source;
}
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();

export default loader;