import React from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

import css from './styles.css';

import ScrambleHelper from './scramble';
import TimerHistory from './history';

const LOCAL_STORAGE_KEY = 'CUBE_TIMER_STORAGE';

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
            timerHistory: localStorage.getItem(LOCAL_STORAGE_KEY) || '[]',
            scramble: '',
            cubeString: '',
            nextScramble: '',
            nextCubeString: '',
        };
    }

    componentDidMount() {
        const timerInterval = setInterval(this.updateTimerProgress, 333);
        this.setState({
            timerInterval,
        });

        addEventListener('keydown', this.handleKeyDown);
        addEventListener('keyup', this.handleKeyUp);

        this.getNewScramble();
    }

    componentWillUnmount() {
        const { timerInterval } = this.state;
        if (typeof timerInterval === 'number') {
            console.log('clearing', timerInterval);
            clearInterval(timerInterval);
        }

        removeEventListener('keydown', this.handleKeyDown);
        removeEventListener('keyup', this.handleKeyUp);
    }

    getNewScramble = async () => {
        const { nextScramble, nextCubeString } = this.state;

        if (nextScramble && nextCubeString) {
            this.setState({
                scramble: nextScramble,
                cubeString: nextCubeString,
            });
        } else {
            const res = await axios.get('/api/cube-3x3-scramble');
            const { scramble, cubeString } = res.data;
            this.setState({
                scramble,
                cubeString,
            });
        }
        const res2 = await axios.get('/api/cube-3x3-scramble');
        const { scramble: scramble2, cubeString: cubeString2 } = res2.data;
        this.setState({
            nextScramble: scramble2,
            nextCubeString: cubeString2,
        });
    };

    handleKeyDown = event => {
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

    handleKeyUp = event => {
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
        const { key1Pressed, key2Pressed, timerState, timerTimeout } = this.state;
        if (timerState === 'standby' && key1Pressed && key2Pressed) {
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
                    }, 1000);
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
                this.storeTime
            );
        }
    };

    handleResetTimer = e => {
        this.setState({
            timerState: 'standby',
            scramble: '',
            cubeString: '',
        });
        this.getNewScramble();
        e.target.blur();
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

    storeTime = () => {
        const { scramble, cubeString, timerHistory } = this.state;
        const timerHistoryObj = JSON.parse(timerHistory);
        timerHistoryObj.push({
            id: uuid(),
            scramble,
            cubeString,
            time: this.getTime(),
            createdAt: new Date(),
        });
        const newTimeHistory = JSON.stringify(timerHistoryObj);
        this.setState({
            timerHistory: newTimeHistory,
        });
        localStorage.setItem(LOCAL_STORAGE_KEY, newTimeHistory);
    };

    removeTime = id => {
        const { timerHistory } = this.state;
        const timerHistoryObj = JSON.parse(timerHistory);
        const newTimeHistory = JSON.stringify(timerHistoryObj.filter(a => a.id !== id));
        this.setState({
            timerHistory: newTimeHistory,
        });
        localStorage.setItem(LOCAL_STORAGE_KEY, newTimeHistory);
    };

    render() {
        const { timerHistory, timerState, scramble, cubeString } = this.state;

        return (
            <div className={css.cubeTimer}>
                <h2>Cube Timer</h2>
                <p>Press Numpad 1 and 5 together to start and stop.</p>
                <div className={css.timerDisplay}>
                    {['run', 'stop'].includes(timerState) ? (
                        <span className={css.timerTime}>{this.getFormatedTime()}</span>
                    ) : (
                        <span className={css.timerStatus}>{timerState}</span>
                    )}
                </div>
                <button onClick={this.handleResetTimer}>Reset</button>
                <ScrambleHelper cubeString={cubeString} scramble={scramble} />
                <TimerHistory
                    timerHistory={JSON.parse(timerHistory)}
                    removeTime={this.removeTime}
                />
            </div>
        );
    }
}
