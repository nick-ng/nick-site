import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';

import getRouter from './routes';
import rootReducer from './stores';

const store = createStore(
  rootReducer,
  compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ),
);

ReactDOM.render(
  <Provider store={store}>
    <div>
      {getRouter(store)}
    </div>
  </Provider>,
  document.getElementById('root'),
);
