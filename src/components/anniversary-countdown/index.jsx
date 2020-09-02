import React from 'react';
import styled from 'styled-components';

const WEDDING_ANNIVERSARY = new Date('2018-09-23T00:00:00+1200');
const SIZE_RATIO = 5184000000; // 60 days

const MonoSpan = styled.span.attrs((props) => {
  const size = Math.max(1, Math.min(5, props.size || 1));
  return {
    style: {
      fontSize: `${size}em`,
    },
  };
})`
  font-family: monospace;
`;

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

const getGetOrdinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const millisecondsUntilAnniversary = () => {
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < 10000000; i++) {
    // eslint-disable-line no-plusplus
    const nextAnniversary = new Date(WEDDING_ANNIVERSARY).setFullYear(
      currentYear + i
    );
    if (nextAnniversary > new Date()) {
      return nextAnniversary - new Date();
    }
  }
};

const ordinalAnniversary = () => {
  const anniversaryYear = WEDDING_ANNIVERSARY.getFullYear();

  for (let i = 0; i < 10000000; i++) {
    // eslint-disable-line no-plusplus
    const nextAnniversary = new Date(WEDDING_ANNIVERSARY).setFullYear(
      anniversaryYear + i
    );
    if (nextAnniversary > new Date()) {
      return getGetOrdinal(i);
    }
  }
  return 0;
};

export const getNextAnniversary = () => {
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < 10000000; i++) {
    // eslint-disable-line no-plusplus
    const nextAnniversary = new Date(WEDDING_ANNIVERSARY).setFullYear(
      currentYear + i
    );
    if (nextAnniversary > new Date()) {
      return {
        date: nextAnniversary,
        ordinal: ordinalAnniversary(),
      };
    }
  }

  return {
    date: new Date(),
    ordinal: '',
  };
};

export default class AnniversaryCountdown extends React.Component {
  constructor(props) {
    super(props);

    const urlParams = new URLSearchParams(window.location.search);

    this.state = {
      timeFormat: parseInt(urlParams.get('tf'), 10),
      precision: parseInt(urlParams.get('p'), 10),
      timeString: '',
      timeUnit: '',
      timeMilliseconds: 1,
      ordinal: '0th',
      intervalId: null,
    };

    this.updateTimeString = this.updateTimeString.bind(this);
  }

  componentDidMount() {
    this.updateTimeString();
    const intervalId = setInterval(this.updateTimeString, 17);
    this.setState({
      intervalId,
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  updateTimeString() {
    const { timeFormat, precision } = this.state;
    const milliseconds = millisecondsUntilAnniversary();
    const ordinal = ordinalAnniversary();
    this.setState({
      ordinal,
      timeMilliseconds: milliseconds,
    });
    let factor = 1;

    if (timeFormat && !isNaN(timeFormat) && conversionFactors[timeFormat]) {
      let time = milliseconds;
      for (let i = 0; i <= timeFormat; i++) {
        // eslint-disable-line no-plusplus
        time = time / conversionFactors[i].factor; // eslint-disable-line operator-assignment
        factor = factor * conversionFactors[i].factor; // eslint-disable-line operator-assignment
      }

      const ii = Math.floor(time).toLocaleString({ useGrouping: true });
      const actualPrecision = isNaN(precision)
        ? Math.floor(Math.pow(Math.log10(factor), 1.2)) // eslint-disable-line
        : precision;
      const dd =
        actualPrecision > 0
          ? `.${(time % 10).toFixed(actualPrecision).slice(2)}`
          : '';

      this.setState({
        timeString: `${ii}${dd}`,
        timeUnit: conversionFactors[timeFormat].name,
      });
    } else {
      this.setState({
        timeString: `${milliseconds.toLocaleString({
          useGrouping: true,
        })}`,
        timeUnit: 'milliseconds',
      });
    }
  }

  render() {
    const { ordinal, timeString, timeUnit, timeMilliseconds } = this.state;
    const size = SIZE_RATIO / (timeMilliseconds + 1);

    return (
      <p>
        Only <MonoSpan size={size}>{timeString}</MonoSpan>{' '}
        <span>{timeUnit}</span> until our <span>{ordinal}</span> wedding
        anniversary!
      </p>
    );
  }
}
