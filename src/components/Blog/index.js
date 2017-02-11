import React from 'react';

import css from './styles.css';
import BlogEntry from './BlogEntry';

const posts = [
  {
    id: 1,
    date: new Date(),
    content: '{"entityMap":{},"blocks":[{"key":"4p9ki","text":"Test One!","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":4,"style":"BOLD"},{"offset":6,"length":1,"style":"BOLD"}],"entityRanges":[],"data":{}}]}',
  },
  {
    id: 2,
    date: new Date(),
    content: '{"entityMap":{},"blocks":[{"key":"4p9ki","text":"Test Two!","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":4,"style":"BOLD"}],"entityRanges":[],"data":{}}]}',
  },
  {
    id: 3,
    date: new Date(),
    content: '{"entityMap":{},"blocks":[{"key":"4p9ki","text":"Test Three!","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":4,"style":"BOLD"}],"entityRanges":[],"data":{}}]}',
  },
];

export default function Blog() {
  return (
    <div className={css.blogStyle}>
      {posts.map((post, index) => (
        <BlogEntry
          key={`blogEntry${post.id}`}
          renderNumber={index}
          {...post}
        />
        ))}
    </div>
  );
}
