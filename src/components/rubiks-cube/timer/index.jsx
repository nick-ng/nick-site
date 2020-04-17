import React from 'react';
import axios from 'axios';

import css from './styles.css';

import ScrambleHelper from './scramble';

export default class CubeTimer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            key1Pressed: false,
            key2Pressed: false,
            key1: 'Numpad1',
            key2: 'Numpad5',
            timerState: 'standby',
            timerStart: null,
            timerEnd: null,
            timerInterval: null,
            timerProgress: null,
            scramble: '',
            cubeString: '',
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
        const res = await axios.get('/api/cube-3x3-scramble');
        const { scramble, cubeString } = res.data;
        this.setState({
            scramble,
            cubeString,
        });
    };

    handleKeyDown = event => {
        const { key1, key2 } = this.state;
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
            default:
            // do nothing
        }
    };

    handleKeyUp = event => {
        const { key1, key2 } = this.state;
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
        const { key1Pressed, key2Pressed, timerState } = this.state;
        if (timerState === 'standby' && key1Pressed && key2Pressed) {
            this.setState({
                timerState: 'ready',
                timerProgress: 0,
            });
        } else if (timerState === 'ready' && (!key1Pressed || !key2Pressed)) {
            this.setState({
                timerState: 'run',
                timerStart: new Date(),
            });
        } else if (timerState === 'run' && key1Pressed && key2Pressed) {
            this.setState({
                timerState: 'stop',
                timerEnd: new Date(),
            });
        }
    };

    handleResetTimer = () => {
        this.setState({
            timerState: 'standby',
            scramble: '',
            cubeString: '',
        });
        this.getNewScramble();
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

    render() {
        const { timerState, scramble, cubeString } = this.state;

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
            </div>
        );
    }
}
