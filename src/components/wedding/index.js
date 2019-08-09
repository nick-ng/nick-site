import React from 'react';

import css from './styles.css';

const weddingAnniversary = new Date('2018-09-23T00:00:00+1200');

const conversionFactors = [
  {
    name: 'milliseconds',
    factor: 1,
  },
  {
    name: 'seconds',
    factor: 1000,
  },
  {
    name: 'minutes',
    factor: 60,
  },
  {
    name: 'hours',
    factor: 60,
  },
  {
    name: 'days',
    factor: 24,
  },
  {
    name: 'years',
    factor: 365.2422,
  },
  {
    name: 'millennia',
    factor: 1000,
  },
];

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
    const milliseconds = millisecondsUntilAnniversary();
    let factor = 1;

    if (timeFormat && !isNaN(timeFormat) && conversionFactors[timeFormat]) {
      let time = milliseconds;
      for (let i = 0; i <= timeFormat; i++) { // eslint-disable-line no-plusplus
        time /= conversionFactors[i].factor;
        factor *= conversionFactors[i].factor;
      }

      const ii = Math.floor(time).toLocaleString({ useGrouping: true });
      const actualPrecision = isNaN(precision)
        ? Math.floor(Math.log10(factor) ** 1.2)
        : precision;
      const dd = actualPrecision > 0
        ? `.${(time % 10).toFixed(actualPrecision).slice(2)}`
        : '';

      this.setState({
        timeString: `${ii}${dd} ${conversionFactors[timeFormat].name}`,
      });
    } else {
      this.setState({
        timeString: `${milliseconds.toLocaleString({ useGrouping: true })} milliseconds`,
      });
    }
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
