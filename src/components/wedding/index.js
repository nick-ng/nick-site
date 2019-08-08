import React from 'react';

import css from './styles.css';

const weddingAnniversary = new Date('2018-09-23T00:00:00+1200');

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const timeUntilAnniversary = () => {
  const currentYear = (new Date()).getFullYear();
  let nextAnniversary = new Date(weddingAnniversary).setFullYear(currentYear);

  for (let i = 0; i < 10000000; i++) { // eslint-disable-line no-plusplus
    if (nextAnniversary > new Date()) {
      break;
    }
    nextAnniversary = new Date(weddingAnniversary).setFullYear(currentYear + i);
  }
  const millisecondsRemaining = nextAnniversary - new Date();

  return numberWithCommas(millisecondsRemaining);
};

class Wedding extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      milliseconds: '',
    };

    this.updateMilliseconds = this.updateMilliseconds.bind(this);

    setInterval(this.updateMilliseconds, 11);
  }

  updateMilliseconds() {
    this.setState({
      milliseconds: timeUntilAnniversary(),
    });
  }

  render() {
    const { milliseconds } = this.state;
    return (<div className={css.container}>
      <h1>Sylvia and Nick</h1>
      <h3>{`Only ${milliseconds} milliseconds until our next wedding anniversary!`}</h3>
    </div>);
  }
}

export default Wedding;
