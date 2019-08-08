import React from 'react';

import css from './styles.css';

const weddingAnniversary = new Date('2018-09-23T00:00:00+1200');

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const millisecondsUntilAnniversary = () => {
  const currentYear = (new Date()).getFullYear();
  let nextAnniversary = new Date(weddingAnniversary).setFullYear(currentYear);

  for (let i = 0; i < 10000000; i++) { // eslint-disable-line no-plusplus
    if (nextAnniversary > new Date()) {
      break;
    }
    nextAnniversary = new Date(weddingAnniversary).setFullYear(currentYear + i);
  }
  return nextAnniversary - new Date();
};

const millenniaUntilAnniversary = (milliseconds) => {
  const seconds = milliseconds / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const years = days / 365.2422;
  return years / 1000;
};

class Wedding extends React.Component {
  constructor(props) {
    super(props);

    const urlParams = new URLSearchParams(window.location.search);

    this.state = {
      timeFormat: parseInt(urlParams.get('tf'), 10),
      precision: parseInt(urlParams.get('p'), 10),
      timeString: '',
    };

    this.updateTimeString = this.updateTimeString.bind(this);

    setInterval(this.updateTimeString, 11);
  }

  updateTimeString() {
    const { timeFormat, precision } = this.state;
    let timeString = '';
    if (timeFormat === 2) {
      const millennia = millenniaUntilAnniversary(millisecondsUntilAnniversary())
        .toFixed(precision || 30);
      timeString = `${millennia} millennia`;
    } else {
      const milliseconds = numberWithCommas(millisecondsUntilAnniversary());
      timeString = `${milliseconds} milliseconds`;
    }
    this.setState({
      timeString,
    });
  }

  render() {
    const { timeString } = this.state;
    return (<div className={css.container}>
      <h1>Sylvia and Nick</h1>
      <h3>{`Only ${timeString} until our next wedding anniversary!`}</h3>
    </div>);
  }
}

export default Wedding;
