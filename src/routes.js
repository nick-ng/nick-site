import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
// import { syncHistoryWithStore } from 'react-router-redux';

import App from './components/App';
import Blog from './components/Blog';
import Test from './components/Test';

export default function getRouter() {
  // const history = syncHistoryWithStore(browserHistory, store);

  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Blog} />
        <Route path="test(/:number)" component={Test} />
      </Route>
    </Router>
  );
}
