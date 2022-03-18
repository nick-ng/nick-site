import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import axios from 'axios';

import MarkdownDisplay from '../markdown-display';

const Container = styled.div``;

const BlogPost = styled.div`
  max-width: 35em;
  width: 30em;
  padding: 0 0 0.5em;
  border-bottom: 1px solid lightgrey;
`;

const BlogPostDate = styled.div`
  width: 100%;
  text-align: right;
`;

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const res = await axios.get('/api/markdown-document/public');
      setBlogPosts(res.data);
    };

    fetchBlogPosts();
  }, []);

  return (
    <Container>
      {blogPosts.map((blogPost) => {
        let displayDate = dayjs(blogPost.publishAt);
        if (displayDate > dayjs()) {
          displayDate = dayjs();
        }

        return (
          <BlogPost key={blogPost.title}>
            <MarkdownDisplay content={blogPost.content} />
            <BlogPostDate>{displayDate.format('D MMM YYYY')}</BlogPostDate>
          </BlogPost>
        );
      })}
    </Container>
  );
}
