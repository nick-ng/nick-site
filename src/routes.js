import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import App from './components/App';
import Blog from './components/Blog';
import PostEditor from './components/PostEditor';
import Test from './components/Test';

export default function getRouter(store) {
  const history = syncHistoryWithStore(browserHistory, store);

  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Blog} />
        <Route path="test(/:number)" component={Test} />
        <Route path="editor(/:postId)" component={PostEditor} />
      </Route>
    </Router>
  );
}
