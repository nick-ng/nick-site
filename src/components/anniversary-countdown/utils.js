const WEDDING_ANNIVERSARY = new Date('2018-09-23T14:00:00+1200');

const getGetOrdinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
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

export const millisecondsUntilAnniversary = () => {
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

export const getNextAnniversary = () => {
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < 10000000; i++) {
    // eslint-disable-line no-plusplus
    const nextAnniversary = new Date(WEDDING_ANNIVERSARY).setFullYear(
      currentYear + i
    );
    const previousAnniversary = new Date(WEDDING_ANNIVERSARY).setFullYear(
      currentYear + i - 1
    );

    if (nextAnniversary > new Date()) {
      return {
        date: nextAnniversary,
        previousAnniversary,
        ms: millisecondsUntilAnniversary(),
        ordinal: ordinalAnniversary(),
      };
    }
    previousAnniversary = nextAnniversary;
  }

  return {
    date: new Date(),
    previousAnniversary: new Date(),
    ms: millisecondsUntilAnniversary(),
    ordinal: '',
  };
};

export const formatMSHMMSS = (ms) => {
  if (ms < 0) {
    return '0';
  }
  const temp = Math.ceil(ms / 1000);
  const hours = Math.floor(temp / (60 * 60));
  const temp2 = temp - hours * 60 * 60;
  const minutes = Math.floor(temp2 / 60);
  const seconds = temp2 % 60;

  return [
    hours,
    (minutes > 0 || hours > 0) && hours > 0
      ? `${minutes}`.padStart(2, '0')
      : minutes,
    minutes > 0 || hours > 0 ? `${seconds}`.padStart(2, '0') : seconds,
  ]
    .filter((a) => a)
    .join(':');
};

export const conversionFactors = [
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
