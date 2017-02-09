import React from 'react';

import css from './styles.css';
import BlogEntry from './BlogEntry';

const numbers = [1, 2, 3, 4, 5];

export default function Blog() {
  return (
    <div className={css.blogStyle}>
      {numbers.map(number => <BlogEntry
        number={number}
        key={`blogEntry${number}`}
      />)}
    </div>
  );
}
