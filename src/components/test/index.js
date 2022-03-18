import React, { useState, useEffect } from 'react';

const Test = () => {
  useEffect(() => {
    const popupVideoId = setTimeout(() => {
      window.open('https://www.youtube.com/watch?v=PWgvGjAhvIw', '_blank');
    }, 1000);

    return () => {
      clearTimeout(popupVideoId);
    };
  }, []);

  return (
    <div>
      <p>Opening a new tab in 1 seconds.</p>
    </div>
  );
};
export default Test;
