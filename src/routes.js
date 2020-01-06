import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import App from './components/App';
import BlogContainer from './containers/blog-container';
import PostEditorContainer from './containers/post-editor-container';
import Test from './components/Test';
import ScgSearchHelper from './components/scg-search-helper';
import PermuteLastLayerPage from './components/permute-last-layer';
import Wedding from './components/wedding';
import WeddingPhotos from './components/wedding-photos';

export default function getRouter(store) {
  const history = syncHistoryWithStore(browserHistory, store);

  return (
    <Router history={history}>
      <Route path="/" component={Wedding} />
      <Route path="weddingphotos" component={WeddingPhotos} />
      <Route path="wedding" component={WeddingPhotos} />
      <Route path="blog" component={App}>
        <IndexRoute component={BlogContainer} />
        <Route path="test(/:number)" component={Test} />
        <Route path="editor(/:postId)" component={PostEditorContainer} />
      </Route>
      <Route path="scg" component={ScgSearchHelper} />
      <Route path="pll" component={PermuteLastLayerPage} />
    </Router>
  );
}
