import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

import { getArray, setArray } from '../../../services/foreignStorage';
import css from './styles.css';
import ScrambleHelper from './scramble';
import TimerHistory from './history';
import SessionSelector, {
  getCurrentSession,
  getSessionStorageKey,
} from './session-selector';
import SessionStats from './session-stats';
import { stringToSeconds } from './utils';

const LOCAL_STORAGE_MANUAL_ENTRY_KEY = 'CUBE_TIMER_MANUAL_ENTRY';
export const SESSION_LIMIT = 100000000;
export const CHUNK_LIMIT = 500;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    min-width: 50%;
  }

  @media screen and (max-device-width: 1280px) {
    align-items: flex-start;
    width: 100%;
  }
`;

const LabelH = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TimerDisplay = styled.div`
  flex-basis: 8em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InfoRow = styled.div`
  align-self: stretch;
  display: grid;
  grid-template-columns: auto auto auto auto;
  justify-content: space-between;
  padding: 0.2em 0em;
`;

const ManualEntryInput = styled.input`
  font-size: 5em;
  text-align: center;
  width: 30vw;
`;

export default class CubeTimer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      key1Pressed: false,
      key2Pressed: false,
      key1: 'Numpad1',
      key2: 'Numpad9',
      key12: 'Space',
      timerState: 'standby',
      timerStart: null,
      timerEnd: null,
      timerTimeout: null,
      timerInterval: null,
      timerProgress: null,
      currentLocalStorageKey: getSessionStorageKey(),
      timerHistory: [],
      scramble: '',
      cubeString: '',
      nextScramble: '',
      nextCubeString: '',
      manualEntry:
        localStorage.getItem(LOCAL_STORAGE_MANUAL_ENTRY_KEY) || 'false',
      manualValue: '',
      loading: false,
      saving: false,
    };

    this.manualInputBoxRef = React.createRef();
  }

  async componentDidMount() {
    const timerInterval = setInterval(this.updateTimerProgress, 333);
    this.setState({
      timerInterval,
      loading: true,
    });

    addEventListener('keydown', this.handleKeyDown);
    addEventListener('keyup', this.handleKeyUp);

    this.getNewScramble();

    const currentLocalStorageKey = getSessionStorageKey();

    this.setState({
      timerHistory: await getArray(currentLocalStorageKey),
      loading: false,
    });

    this.focusTextInput();
  }

  componentWillUnmount() {
    const { timerInterval } = this.state;
    if (typeof timerInterval === 'number') {
      clearInterval(timerInterval);
    }

    removeEventListener('keydown', this.handleKeyDown);
    removeEventListener('keyup', this.handleKeyUp);
  }

  updateStorage = async () => {
    const { currentLocalStorageKey, timerHistory } = this.state;
    this.setState({ saving: true });
    await setArray(currentLocalStorageKey, timerHistory, CHUNK_LIMIT);
    this.setState({ saving: false });
  };

  focusTextInput = () => {
    if (this.manualInputBoxRef.current) {
      this.manualInputBoxRef.current.focus();
    }
  };

  getNewScramble = async () => {
    const { nextScramble, nextCubeString } = this.state;

    if (nextScramble && nextCubeString) {
      this.setState({
        scramble: nextScramble,
        cubeString: nextCubeString,
      });
    } else {
      const res = await axios.get('/api/cube-3x3-scramble');
      if (getCurrentSession().includes('BLD')) {
        const { wideScramble, wideCubeString } = res.data;
        this.setState({
          scramble: wideScramble,
          cubeString: wideCubeString,
        });
      } else {
        const { scramble, cubeString } = res.data;
        this.setState({
          scramble,
          cubeString,
        });
      }
    }
    const res2 = await axios.get('/api/cube-3x3-scramble');
    if (getCurrentSession().includes('BLD')) {
      const { wideScramble, wideCubeString } = res2.data;
      this.setState({
        nextScramble: wideScramble,
        nextCubeString: wideCubeString,
      });
    } else {
      const { scramble, cubeString } = res2.data;
      this.setState({
        nextScramble: scramble,
        nextCubeString: cubeString,
      });
    }
  };

  handleKeyDown = (event) => {
    const { key1, key2, key12 } = this.state;
    const { code } = event;
    switch (code) {
      case key1:
        this.setState(
          {
            key1Pressed: true,
          },
          this.updateTimerState
        );
        break;
      case key2:
        this.setState(
          {
            key2Pressed: true,
          },
          this.updateTimerState
        );
        break;
      case key12:
        this.setState(
          {
            key1Pressed: true,
            key2Pressed: true,
          },
          this.updateTimerState
        );
        break;
      default:
      // do nothing
    }
  };

  handleKeyUp = (event) => {
    const { key1, key2, key12 } = this.state;
    const { code } = event;
    switch (code) {
      case key1:
        this.setState(
          {
            key1Pressed: false,
          },
          this.updateTimerState
        );
        break;
      case key2:
        this.setState(
          {
            key2Pressed: false,
          },
          this.updateTimerState
        );
        break;
      case key12:
        this.setState(
          {
            key1Pressed: false,
            key2Pressed: false,
          },
          this.updateTimerState
        );
        break;
      default:
      // do nothing
    }
  };

  updateTimerProgress = () => {
    const { timerState, timerStart } = this.state;

    if (timerState === 'run') {
      this.setState({
        timerProgress: (new Date() - timerStart) / 1000,
      });
    }
  };

  updateTimerState = () => {
    const {
      key1Pressed,
      key2Pressed,
      timerState,
      timerTimeout,
      manualEntry,
    } = this.state;

    if (manualEntry === 'true') {
      return;
    }

    if (
      ['stop', 'standby'].includes(timerState) &&
      key1Pressed &&
      key2Pressed
    ) {
      this.setState(
        {
          timerState: 'wait',
        },
        () => {
          const timerTimeout = setTimeout(() => {
            this.setState(
              {
                timerState: 'ready',
                timerProgress: 0,
                timerTimeout: null,
              },
              this.updateTimerState
            );
          }, 500);
          this.setState({
            timerTimeout,
          });
        }
      );
    } else if (timerState === 'wait' && (!key1Pressed || !key2Pressed)) {
      clearTimeout(timerTimeout);
      this.setState({
        timerState: 'standby',
        timerTimeout: null,
      });
    } else if (timerState === 'ready' && (!key1Pressed || !key2Pressed)) {
      this.setState({
        timerState: 'run',
        timerStart: new Date(),
      });
    } else if (timerState === 'run' && key1Pressed && key2Pressed) {
      this.setState(
        {
          timerState: 'stop',
          timerEnd: new Date(),
        },
        () => {
          this.storeTime();
          this.getNewScramble();
        }
      );
    }
  };

  handleResetTimer = (e) => {
    this.setState({
      timerState: 'standby',
      scramble: '',
      cubeString: '',
    });
    this.getNewScramble();
    if (e) {
      e.target.blur();
    }
  };

  getTime = () => {
    const { timerStart, timerEnd } = this.state;

    return Math.floor((timerEnd - timerStart) / 10) / 100;
  };

  getFormatedTime = () => {
    const { timerState, timerProgress } = this.state;

    if (timerState === 'run') {
      return Math.floor(timerProgress);
    } else if (timerState === 'stop') {
      return this.getTime().toFixed(2);
    }

    return '0';
  };

  storeTime = (time = null, options = {}) => {
    const { scramble, timerHistory } = this.state;

    timerHistory.push({
      id: uuid(),
      scramble: options.scramble || scramble || '',
      time: typeof time === 'number' ? time : this.getTime(),
      createdAt: options.createdAt || Date.now(),
    });

    this.setState(
      {
        timerHistory: timerHistory
          .map(({ id, scramble, time, createdAt }) => ({
            id,
            scramble,
            time,
            createdAt: moment(createdAt).valueOf(),
          }))
          .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateA - dateB;
          })
          .slice(0, SESSION_LIMIT),
      },
      this.updateStorage
    );
  };

  removeTime = (id, time = '') => {
    if (confirm(`Delete time of ${time}?`)) {
      const { timerHistory } = this.state;
      const newTimeHistory = timerHistory.filter((a) => a.id !== id);
      this.setState(
        {
          timerHistory: newTimeHistory,
        },
        this.updateStorage
      );
    }

    this.focusTextInput();
  };

  togglePenalty = (id) => {
    const { timerHistory } = this.state;
    const penaltyTime = timerHistory.filter((a) => a.id === id)[0];
    penaltyTime.penalty = !penaltyTime.penalty;
    const newTimeHistory = timerHistory
      .filter((a) => a.id !== id)
      .concat(penaltyTime);
    this.setState(
      {
        timerHistory: newTimeHistory,
      },
      this.updateStorage
    );
    this.focusTextInput();
  };

  editTime = (id) => {
    const { timerHistory } = this.state;
    const time = timerHistory.filter((a) => a.id === id)[0];

    let newTime = null;
    do {
      const temp = prompt('Enter the correct time.');
      if (temp === null) {
        newTime = time.time;
      } else {
        try {
          newTime = stringToSeconds(temp);
        } catch (e) {
          console.warn(e);
        }
      }
    } while (newTime === null);

    if (newTime) {
      time.time = newTime;
      const newTimeHistory = timerHistory
        .filter((a) => a.id !== id)
        .concat(time);
      this.setState(
        {
          timerHistory: newTimeHistory,
        },
        this.updateStorage
      );
    }

    this.focusTextInput();
  };

  toggleManualEntry = (e) => {
    if (e) {
      e.target.blur();
    }
    this.setState((prevState) => {
      let newManualEntry = 'true';
      if (prevState.manualEntry === 'true') {
        newManualEntry = 'false';
      }
      localStorage.setItem(LOCAL_STORAGE_MANUAL_ENTRY_KEY, newManualEntry);
      return {
        manualEntry: newManualEntry,
      };
    });

    this.focusTextInput();
  };

  handleManualInput = (event) => {
    this.setState({
      manualValue: event.target.value,
    });
  };

  handleManualEntrySubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    const { manualValue } = this.state;
    try {
      this.storeTime(stringToSeconds(manualValue));
      this.handleResetTimer();
      this.setState({
        manualValue: '',
      });
    } catch (e) {
      alert('Invalid input');
    }
  };

  render() {
    const {
      timerHistory,
      timerState,
      scramble,
      cubeString,
      manualEntry,
      manualValue,
      loading,
      saving,
    } = this.state;

    return (
      <Container>
        <h2>
          Cube Timer<span>{saving && ' (Saving)'}</span>
          <span>{loading && ' (Loading)'}</span>
        </h2>

        <button onClick={this.handleResetTimer}>Next Scramble</button>
        <InfoRow>
          <SessionSelector />
          <ScrambleHelper cubeString={cubeString} scramble={scramble} />
          <SessionStats timerHistory={timerHistory} />
        </InfoRow>
        <LabelH>
          <input
            type="checkbox"
            checked={manualEntry === 'true'}
            onChange={this.toggleManualEntry}
          />
          Manual Entry
        </LabelH>
        <TimerDisplay>
          {manualEntry === 'true' ? (
            <form onSubmit={this.handleManualEntrySubmit}>
              <ManualEntryInput
                onChange={this.handleManualInput}
                value={manualValue}
                ref={this.manualInputBoxRef}
                type="tel"
              />
            </form>
          ) : (
            <>
              <p>Press space to start and stop.</p>
              {['run', 'stop'].includes(timerState) ? (
                <span className={css.timerTime}>{this.getFormatedTime()}</span>
              ) : (
                <span className={css.timerTime}>{timerState}</span>
              )}
            </>
          )}
        </TimerDisplay>
        {loading && <p>Loading...</p>}
        <TimerHistory
          timerHistory={timerHistory}
          removeTime={this.removeTime}
          togglePenalty={this.togglePenalty}
          storeTime={this.storeTime}
          editTime={this.editTime}
        />
      </Container>
    );
  }
}
