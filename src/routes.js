import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import App from './components/App';
import BlogContainer from './containers/blog-container';
import PostEditorContainer from './containers/post-editor-container';
import Test from './components/Test';

export default function getRouter(store) {
  const history = syncHistoryWithStore(browserHistory, store);

  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={BlogContainer} />
        <Route path="test(/:number)" component={Test} />
        <Route path="editor(/:postId)" component={PostEditorContainer} />
      </Route>
    </Router>
  );
}
