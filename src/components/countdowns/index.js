import React from 'react';
import axios from 'axios';
import moment from 'moment';
import cx from 'classnames';

import Loading from '../loading';
import { getNextAnniversary } from '../anniversary-countdown';
import { getFormData } from '../../utils/dom';

import css from './styles.css';

const getS = number => (number === 1 ? '' : 's');

const getSize = secondsLeft => {
    const maxSize = 10;
    const minSize = 1;
    const daysLeft = secondsLeft / 86400;
    const size = 20 - daysLeft;

    return Math.min(maxSize, Math.max(minSize, size));
};

const getStyleText = secondsLeft => ({
    fontSize: `${getSize(secondsLeft)}em`,
});

const getStyleText2 = secondsLeft => {
    const a = getSize(secondsLeft) / 2;

    return {
        fontSize: `${(a - 1) / 9 + 1}em`,
    };
};

const getStyleMargin = secondsLeft => {
    const a = getSize(secondsLeft) - 1;

    return {
        margin: `0 0 -${a / 5}em`,
    };
};

export default class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            countdowns: [],
            countdownsFetched: false,
            visibleEditors: {},
        };

        this.toggleEditor = this.toggleEditor.bind(this);
        this.addCountdownHandler = this.addCountdownHandler.bind(this);
        this.editCountdownHandler = this.editCountdownHandler.bind(this);
        this.deleteCountdownHandler = this.deleteCountdownHandler.bind(this);
    }

    componentDidMount() {
        this.getCountdowns();
        this.setState({
            updateTimerInterval: setInterval(() => {
                this.updateTimers();
            }, 300),
        });
    }

    componentWillUnmount() {
        const { updateTimerInterval } = this.state;
        clearInterval(updateTimerInterval);
    }

    async getCountdowns() {
        this.setState({
            countdownsFetched: false,
            visibleEditors: {},
        });
        const res = await axios.get('api/countdowns');
        const { countdowns } = res.data;

        const temp = getNextAnniversary();
        const weddingAnniversaryCountdown = {
            endTime: temp.date,
            id: 'wedding-anniversary',
            name: `${temp.ordinal} wedding anniversary`,
        };
        this.setState({
            countdowns: [weddingAnniversaryCountdown, ...countdowns],
            countdownsFetched: true,
        });
    }

    updateTimers() {
        this.setState(state => {
            const { countdowns } = state;
            const countdownsWithTimers = countdowns
                .map(countdown => {
                    const { endTime } = countdown;
                    const secondsLeft = moment(endTime).diff(moment(), 'seconds');
                    const days = Math.floor(secondsLeft / 86400);
                    const hours = Math.abs(Math.floor((secondsLeft % 86400) / 3600));
                    const minutes = Math.abs(Math.floor((secondsLeft % 3600) / 60));
                    const seconds = Math.abs(Math.floor(secondsLeft % 60));

                    return Object.assign({}, countdown, {
                        days,
                        hours,
                        minutes,
                        seconds,
                        secondsLeft,
                    });
                })
                // .filter(countdown => countdown.days > -5)
                .sort((a, b) => a.secondsLeft - b.secondsLeft);

            return {
                countdowns: countdownsWithTimers,
            };
        });
    }

    toggleEditor(id) {
        this.setState(prevState => {
            const { visibleEditors } = prevState;
            return {
                visibleEditors: Object.assign({}, visibleEditors, {
                    [id]: !visibleEditors[id],
                }),
            };
        });
    }

    addCountdownHandler(e) {
        const newCountdown = getFormData(e.target);
        e.target.reset();
        e.preventDefault();

        newCountdown.endTime = moment(
            `${newCountdown.endDate} ${newCountdown.endTime}`
        ).toISOString();

        if (!newCountdown.name) {
            return;
        }

        this.setState(
            {
                countdownsFetched: false,
            },
            async () => {
                await axios.post('api/countdowns', newCountdown);
                this.getCountdowns();
            }
        );
    }

    editCountdownHandler(e, id) {
        const updatedCountdown = getFormData(e.target);
        e.target.reset();
        e.preventDefault();
        this.setState(
            {
                countdownsFetched: false,
            },
            async () => {
                await axios.put(`api/countdowns/${id}`, updatedCountdown);
                this.getCountdowns();
            }
        );
    }

    deleteCountdownHandler(id) {
        this.setState(
            {
                countdownsFetched: false,
            },
            async () => {
                await axios.delete(`api/countdowns/${id}`);
                this.getCountdowns();
            }
        );
    }

    render() {
        const { countdowns, countdownsFetched, visibleEditors } = this.state;
        return (
            <div className={css.container}>
                <h2>Countdowns</h2>
                <form className={css.controls} onSubmit={this.addCountdownHandler}>
                    <input type="date" name="endDate" placeholder="End Date" />
                    <input type="time" name="endTime" placeholder="End Time" defaultValue="17:00" />
                    <input type="text" name="name" placeholder="Name" />
                    <button type="submit">
                        <i className={cx('fa', 'fa-plus')}></i>
                    </button>
                </form>
                <hr />
                {countdownsFetched ? (
                    <div className={css.countdowns}>
                        {countdowns.length > 0 ? (
                            countdowns.map(
                                ({ id, days, hours, minutes, seconds, secondsLeft, name }) =>
                                    days && (
                                        <div
                                            className={css.countdownColumn}
                                            key={`countdown-${id}`}
                                        >
                                            <div
                                                className={cx(css.countdownTimer, {
                                                    [css.overdue]: days < 0,
                                                })}
                                                style={getStyleMargin(secondsLeft)}
                                            >
                                                <span style={getStyleText(secondsLeft)}>
                                                    {days}
                                                </span>
                                                <label style={getStyleText2(secondsLeft)}>
                                                    d,&nbsp;
                                                </label>
                                                <span style={getStyleText(secondsLeft)}>
                                                    {`${hours}`.padStart(2, '0')}
                                                </span>
                                                <label style={getStyleText2(secondsLeft)}>
                                                    h,&nbsp;
                                                </label>
                                                <span style={getStyleText(secondsLeft)}>
                                                    {`${minutes}`.padStart(2, '0')}
                                                </span>
                                                <label style={getStyleText2(secondsLeft)}>
                                                    m,&nbsp;
                                                </label>
                                                <span style={getStyleText(secondsLeft)}>
                                                    {`${seconds}`.padStart(2, '0')}
                                                </span>
                                                <label style={getStyleText2(secondsLeft)}>s</label>
                                            </div>
                                            <div
                                                className={css.countdownRow}
                                                style={getStyleText2(secondsLeft)}
                                            >
                                                <label
                                                    className={cx({
                                                        [css.overdue]: days < 0,
                                                    })}
                                                >
                                                    {name}
                                                </label>
                                                {id > 0 && (
                                                    <React.Fragment>
                                                        <i
                                                            className={cx('fa', 'fa-pencil')}
                                                            role="button"
                                                            onClick={() => this.toggleEditor(id)}
                                                        ></i>
                                                        {visibleEditors[id] && (
                                                            <form
                                                                className={css.controls}
                                                                onSubmit={e =>
                                                                    this.editCountdownHandler(e, id)
                                                                }
                                                            >
                                                                <input
                                                                    type="date"
                                                                    name="endDate"
                                                                    placeholder="New End Date"
                                                                />
                                                                <input
                                                                    type="time"
                                                                    name="endTime"
                                                                    placeholder="New End Time"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    placeholder="New Name"
                                                                />
                                                                <button type="submit">
                                                                    <i
                                                                        className={cx(
                                                                            'fa',
                                                                            'fa-save'
                                                                        )}
                                                                    ></i>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        this.deleteCountdownHandler(
                                                                            id
                                                                        )
                                                                    }
                                                                >
                                                                    <i
                                                                        className={cx(
                                                                            'fa',
                                                                            'fa-trash'
                                                                        )}
                                                                    ></i>
                                                                </button>
                                                            </form>
                                                        )}
                                                    </React.Fragment>
                                                )}
                                            </div>
                                        </div>
                                    )
                            )
                        ) : (
                            <div className={css.fadeIn}>Nothing here!</div>
                        )}
                    </div>
                ) : (
                    <Loading />
                )}
            </div>
        );
    }
}
