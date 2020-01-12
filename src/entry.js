import React from 'react';
import ReactDOM from 'react-dom';
// import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
// import thunk from 'redux-thunk';

import Router from './routes';
import rootReducer from './stores';

// const store = createStore(
//   rootReducer,
//   compose(
//     applyMiddleware(thunk),
//     window.devToolsExtension ? window.devToolsExtension() : f => f,
//   ),
// );

// ReactDOM.render(
//   <Provider store={store}>
//     <div>
//       {Router(store)}
//     </div>
//   </Provider>,
//   document.getElementById('root'),
// );

ReactDOM.render(
    <Router />,
    document.getElementById('root'),
);