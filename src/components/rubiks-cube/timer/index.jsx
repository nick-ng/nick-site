import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import css from './styles.css';

import ScrambleHelper from './scramble';
import TimerHistory from './history';

const LOCAL_STORAGE_KEY = 'CUBE_TIMER_STORAGE';
const LOCAL_STORAGE_MANUAL_ENTRY_KEY = 'CUBE_TIMER_MANUAL_ENTRY';

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
            timerHistory: localStorage.getItem(LOCAL_STORAGE_KEY) || '[]',
            scramble: '',
            cubeString: '',
            nextScramble: '',
            nextCubeString: '',
            manualEntry: localStorage.getItem(LOCAL_STORAGE_MANUAL_ENTRY_KEY) || false,
            manualValue: '',
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

    storeTime = (time = null, n = 1) => {
        const { scramble, cubeString, timerHistory } = this.state;
        const timerHistoryObj = JSON.parse(timerHistory);
        for (let i = 0; i < n; i++) {
            timerHistoryObj.push({
                id: uuid(),
                scramble: i === 0 ? scramble : '',
                cubeString: i === 0 ? cubeString : '',
                time: typeof time === 'number' ? time : this.getTime(),
                createdAt: new Date(),
            });
        }
        const newTimeHistoryObj = timerHistoryObj
            .sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateA - dateB;
            })
            .slice(0, 10000);
        const newTimeHistory = JSON.stringify(newTimeHistoryObj);
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

    togglePenalty = id => {
        const { timerHistory } = this.state;
        const timerHistoryObj = JSON.parse(timerHistory);
        const penaltyTime = timerHistoryObj.filter(a => a.id === id)[0];
        penaltyTime.penalty = !penaltyTime.penalty;
        const newTimeHistory = JSON.stringify(
            timerHistoryObj.filter(a => a.id !== id).concat(penaltyTime)
        );
        this.setState({
            timerHistory: newTimeHistory,
        });
        localStorage.setItem(LOCAL_STORAGE_KEY, newTimeHistory);
    };

    toggleManualEntry = () => {
        this.setState(prevState => {
            localStorage.setItem(LOCAL_STORAGE_MANUAL_ENTRY_KEY, !prevState.manualEntry);
            return {
                manualEntry: !prevState.manualEntry,
            };
        });
    };

    handleManualInput = event => {
        this.setState({
            manualValue: event.target.value,
        });
    };

    handleManualEntrySubmit = event => {
        event.preventDefault();

        const { manualValue } = this.state;
        if (parseFloat(manualValue)) {
            this.storeTime(parseFloat(manualValue));
            this.handleResetTimer();
            this.setState({
                manualValue: '',
            });
        } else if ('dnf'.localeCompare(manualValue, 'en', { sensitivity: 'accent' }) === 0) {
            this.storeTime(9999);
            this.handleResetTimer();
            this.setState({
                manualValue: '',
            });
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
        } = this.state;

        return (
            <div className={css.cubeTimer}>
                <h2>Cube Timer</h2>
                <LabelH>
                    <input type="checkbox" checked={manualEntry} onClick={this.toggleManualEntry} />
                    Manual Entry
                </LabelH>
                <TimerDisplay>
                    {manualEntry ? (
                        <form onSubmit={this.handleManualEntrySubmit}>
                            <ManualEntryInput
                                onChange={this.handleManualInput}
                                value={manualValue}
                            />
                        </form>
                    ) : (
                        <>
                            <p>Press space to start and stop.</p>
                            {['run', 'stop'].includes(timerState) ? (
                                <span className={css.timerTime}>{this.getFormatedTime()}</span>
                            ) : (
                                <span className={css.timerStatus}>{timerState}</span>
                            )}
                        </>
                    )}
                </TimerDisplay>
                <button onClick={this.handleResetTimer}>Next Scramble</button>
                <ScrambleHelper cubeString={cubeString} scramble={scramble} />
                <TimerHistory
                    timerHistory={JSON.parse(timerHistory)}
                    removeTime={this.removeTime}
                    togglePenalty={this.togglePenalty}
                    storeTime={this.storeTime}
                />
            </div>
        );
    }
}
