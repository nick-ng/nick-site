import React, { useState, useEffect } from 'react';

const Test = () => {
  const [colour, setColour] = useState('#111111');
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
      <label>
        Colour:&nbsp;
        <input
          value={colour}
          onChange={(e) => {
            setColour(e.target.value);
          }}
        />
        <span style={{ backgroundColor: colour, color: 'black' }}>
          Black Text
        </span>
        <span style={{ backgroundColor: colour, color: 'white' }}>
          White Text
        </span>
      </label>
    </div>
  );
};
export default Test;
