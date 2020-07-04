import React from 'react';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
import chunk from 'lodash/chunk';
import cx from 'classnames';

import {
    getTotalEVs,
    getDamageFromObjects,
    getModifiers,
    getMoveInfo,
    getCalcQueue,
    processQueue,
    processQueue2,
    hydratePokemon,
} from './utils';
import YOUR_EXAMPLE_POKEMON from './examples/your-pokemon.json';
import EXAMPLE_OPPONENTS from './examples/opponents.json';
import PokemonCard from './pokemon-card';

import css from './styles.css';

const YOUR_LOCAL_STORAGE_KEY = 'ev_finder_your_pokemon';
const OPPONENT_LOCAL_STORAGE_KEY = 'ev_finder_opponent_pokemon';
const MAX_EVS = 508;

const ivs = {
    hp: 31,
    atk: 31,
    def: 31,
    spa: 31,
    spd: 31,
    spe: 31,
};

export default class PokemonEVHelper extends React.Component {
    constructor(props) {
        super(props);

        const yourInput = localStorage.getItem(YOUR_LOCAL_STORAGE_KEY);
        const yourPokemon = JSON.parse(yourInput);
        const opponentInput = localStorage.getItem(OPPONENT_LOCAL_STORAGE_KEY);
        const opponents = JSON.parse(opponentInput);

        this.state = {
            yourInput:
                yourInput || JSON.stringify(YOUR_EXAMPLE_POKEMON, null, '  '),
            yourError: null,
            yourPokemon: yourInput ? yourPokemon : YOUR_EXAMPLE_POKEMON,
            opponentInput:
                opponentInput || JSON.stringify(EXAMPLE_OPPONENTS, null, '  '),
            opponentError: null,
            opponents: opponentInput ? opponents : EXAMPLE_OPPONENTS,
            processed: false,
            processedBruteForce: false,
            progress: null,
            queue: [],
            results: [],
            defensiveEVSpreads50: [],
            outerSort: [],
            innerSort: [],
        };

        this.updateQueue = this.updateQueue.bind(this);
        this.processQueueHandler = this.processQueueHandler.bind(this);
        this.bruteForceHandler = this.bruteForceHandler.bind(this);
        this.yourInputHandler = this.yourInputHandler.bind(this);
        this.opponentInputHandler = this.opponentInputHandler.bind(this);
        this.yourResetHandler = this.yourResetHandler.bind(this);
        this.opponentResetHandler = this.opponentResetHandler.bind(this);
    }

    async componentDidMount() {
        this.updateQueue();
        const res = await fetch('/defensive-ev-spreads-50.json');
        const defensiveEVSpreads50 = await res.json();
        this.setState({
            defensiveEVSpreads50,
        });
    }

    updateQueue(bruteForce = false) {
        const { yourPokemon, opponents } = this.state;
        const queue = getCalcQueue(yourPokemon, opponents);
        this.setState({
            processed: false,
            processedBruteForce: false,
            queue,
        });
    }

    processQueueHandler() {
        const {
            queue,
            yourPokemon: { nature, evs },
        } = this.state;

        this.setState({
            processed: true,
            results: [
                {
                    evSpreadName: `${nature} ${evs.hp}/${evs.atk}/${evs.def}/${evs.spa}/${evs.spd}/${evs.spe}`,
                    calculations: processQueue(queue),
                },
            ],
        });
    }

    async bruteForceHandler() {
        const {
            queue,
            yourPokemon,
            opponents,
            defensiveEVSpreads50,
        } = this.state;
        const goodResults = [];
        const evChunks = chunk(
            defensiveEVSpreads50,
            Math.max(5, 1000 / queue.length)
        );
        const start = new Date();
        await evChunks.reduce(
            (p, chunk, i) =>
                p.then(
                    () =>
                        new Promise(resolve => {
                            const progress = i / evChunks.length;
                            const now = new Date();
                            const elapsed = now - start;
                            const estimate = elapsed / progress;
                            this.setState({
                                progress: `Progress: ${(
                                    (i / evChunks.length) *
                                    100
                                ).toFixed(1)}%. Elapsed: ${(
                                    elapsed / 1000
                                ).toFixed(0)} seconds. Estimate: ${(
                                    estimate / 1000
                                ).toFixed(0)} seconds.`,
                            });
                            for (const evs of chunk) {
                                const total = getTotalEVs(evs);
                                const spare = MAX_EVS - total;
                                const tempPokemon = {
                                    ...yourPokemon,
                                    display: `${yourPokemon.species} ${yourPokemon.evs.nature} ${evs.hp}/x/${evs.def}/x/${evs.spd}/x`,
                                    evs: {
                                        ...evs,
                                        nature: yourPokemon.evs.nature,
                                    },
                                };
                                const calculations = processQueue2(
                                    tempPokemon,
                                    opponents
                                );
                                const a = calculations.reduce(
                                    (p, calc) => p + calc.koChance,
                                    0
                                );
                                const averageKoChance = a / calculations.length;
                                goodResults.push({
                                    evSpreadName: `${yourPokemon.species} ${yourPokemon.evs.nature} ${evs.hp}/x/${evs.def}/x/${evs.spd}/x KOs: ${averageKoChance} Spare: ${spare}`,
                                    calculations,
                                    averageKoChance,
                                    averageKoChanceR: -averageKoChance,
                                    spare,
                                    spareR: -spare,
                                    hp: evs.hp,
                                    hpR: -evs.hp,
                                });
                            }
                            setTimeout(resolve, 10);
                        })
                ),
            Promise.resolve()
        );
        this.setState({
            processedBruteForce: true,
            progress: null,
            results: goodResults,
        });
    }

    yourInputHandler(event) {
        this.setState({
            yourInput: event.target.value,
        });
        try {
            const yourPokemon = JSON.parse(event.target.value);
            this.setState(
                {
                    yourPokemon,
                    yourError: null,
                },
                () => {
                    try {
                        this.updateQueue();
                        localStorage.setItem(
                            YOUR_LOCAL_STORAGE_KEY,
                            JSON.stringify(yourPokemon, null, '  ')
                        );
                    } catch (err) {
                        this.setState({
                            yourError: `${err}`,
                        });
                    }
                }
            );
        } catch (err) {
            this.setState({
                yourError: `${err}`,
            });
        }
    }

    yourResetHandler() {
        if (confirm('Reset your Rokemon?')) {
            this.setState(
                {
                    yourInput: JSON.stringify(YOUR_EXAMPLE_POKEMON, null, '  '),
                    yourError: null,
                    yourPokemon: YOUR_EXAMPLE_POKEMON,
                },
                this.updateQueue
            );
            localStorage.removeItem(YOUR_LOCAL_STORAGE_KEY);
        }
    }

    opponentInputHandler(event) {
        this.setState({
            opponentInput: event.target.value,
        });
        try {
            const opponents = JSON.parse(event.target.value);
            this.setState(
                {
                    opponents,
                    opponentError: null,
                },
                () => {
                    try {
                        this.updateQueue();
                        localStorage.setItem(
                            OPPONENT_LOCAL_STORAGE_KEY,
                            JSON.stringify(opponents, null, '  ')
                        );
                    } catch (err) {
                        this.setState({
                            opponentError: `${err}`,
                        });
                    }
                }
            );
        } catch (err) {
            this.setState({
                opponentError: `${err}`,
            });
        }
    }

    opponentResetHandler() {
        if (confirm('Reset your opponents?')) {
            this.setState(
                {
                    opponentInput: JSON.stringify(
                        EXAMPLE_OPPONENTS,
                        null,
                        '  '
                    ),
                    opponentError: null,
                    opponents: EXAMPLE_OPPONENTS,
                },
                this.updateQueue
            );
            localStorage.removeItem(OPPONENT_LOCAL_STORAGE_KEY);
        }
    }

    makeSortHandler(property, sortControl) {
        return event => {
            if (event.target.checked) {
                this.setState(prevState => {
                    return {
                        [sortControl]: prevState[sortControl].concat([
                            property,
                        ]),
                    };
                });
                return;
            }
            this.setState(prevState => ({
                [sortControl]: prevState[sortControl].filter(
                    a => a !== property
                ),
            }));
        };
    }

    render() {
        const {
            processed,
            processedBruteForce,
            progress,
            queue,
            results,
            yourPokemon,
            yourInput,
            yourError,
            opponentInput,
            opponentError,
            defensiveEVSpreads50,
            outerSort,
            innerSort,
        } = this.state;
        return (
            <div>
                <div className={css.evSpreadContainer}>
                    <div className={css.evSpreadColumn}>
                        <h2>Pokemon EV Helper</h2>
                        <div>Simulation controls go here.</div>
                        <div className={css.buttonRow}>
                            <button
                                disabled={processed}
                                onClick={this.processQueueHandler}
                            >{`Process ${queue.length}`}</button>
                            <button
                                disabled={processedBruteForce}
                                onClick={this.bruteForceHandler}
                            >{`Brute Force ${queue.length *
                                defensiveEVSpreads50.length}`}</button>
                        </div>
                        <div>{`Outer Sort: ${outerSort.join(', ')}`}</div>
                        <div className={css.sortControls}>
                            <div className={css.sortControl}>
                                <div>Average KO</div>
                                <input
                                    type="checkbox"
                                    onChange={this.makeSortHandler(
                                        'averageKoChance',
                                        'outerSort'
                                    )}
                                    checked={outerSort.includes(
                                        'averageKoChance'
                                    )}
                                />
                                <input
                                    type="checkbox"
                                    onChange={this.makeSortHandler(
                                        'averageKoChanceR',
                                        'outerSort'
                                    )}
                                    checked={outerSort.includes(
                                        'averageKoChanceR'
                                    )}
                                />
                            </div>
                            <div className={css.sortControl}>
                                <div>HP EV</div>
                                <input
                                    type="checkbox"
                                    onChange={this.makeSortHandler(
                                        'hp',
                                        'outerSort'
                                    )}
                                    checked={outerSort.includes('hp')}
                                />
                                <input
                                    type="checkbox"
                                    onChange={this.makeSortHandler(
                                        'hpR',
                                        'outerSort'
                                    )}
                                    checked={outerSort.includes('hpR')}
                                />
                            </div>
                            <div className={css.sortControl}>
                                <div>Spare EVs</div>
                                <input
                                    type="checkbox"
                                    onChange={this.makeSortHandler(
                                        'spare',
                                        'outerSort'
                                    )}
                                    checked={outerSort.includes('spare')}
                                />
                                <input
                                    type="checkbox"
                                    onChange={this.makeSortHandler(
                                        'spareR',
                                        'outerSort'
                                    )}
                                    checked={outerSort.includes('spareR')}
                                />
                            </div>
                        </div>
                        <div>{` Inner Sort: ${innerSort.join(', ')}`}</div>
                        <div className={css.sortControls}>
                            <div className={css.sortControl}>
                                <div>OHKO Chance</div>
                                <input
                                    type="checkbox"
                                    onChange={this.makeSortHandler(
                                        'koChance',
                                        'innerSort'
                                    )}
                                    checked={innerSort.includes('koChance')}
                                />
                                <input
                                    type="checkbox"
                                    onChange={this.makeSortHandler(
                                        'koChanceR',
                                        'innerSort'
                                    )}
                                    checked={innerSort.includes('koChanceR')}
                                />
                            </div>
                            <div className={css.sortControl}>
                                <div>Max Damage</div>
                                <input
                                    type="checkbox"
                                    onChange={this.makeSortHandler(
                                        'maxDamage',
                                        'innerSort'
                                    )}
                                    checked={innerSort.includes('maxDamage')}
                                />
                                <input
                                    type="checkbox"
                                    onChange={this.makeSortHandler(
                                        'maxDamageR',
                                        'innerSort'
                                    )}
                                    checked={innerSort.includes('maxDamageR')}
                                />
                            </div>
                        </div>
                        {progress && (
                            <div style={{ whiteSpace: 'pre' }}>{progress}</div>
                        )}
                        {results.length > 0 &&
                            sortBy(results, outerSort)
                                .slice(0, 50)
                                .map(result => (
                                    <div key={result.evSpreadName}>
                                        <label>{result.evSpreadName}</label>
                                        <table className={css.damageResult}>
                                            <thead>
                                                <tr>
                                                    <th className={css.left}>
                                                        Calc
                                                    </th>
                                                    <th>OHKO %</th>
                                                    <th>Max Damage</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortBy(
                                                    result.calculations.filter(
                                                        a => a.maxDamage > 0
                                                    ),
                                                    innerSort
                                                )
                                                    .slice(
                                                        0,
                                                        processedBruteForce
                                                            ? 10
                                                            : -1
                                                    )
                                                    .map(
                                                        ({
                                                            display,
                                                            koChance,
                                                            maxDamage,
                                                            hp,
                                                        }) => {
                                                            return (
                                                                <tr
                                                                    key={
                                                                        display
                                                                    }
                                                                >
                                                                    <td
                                                                        className={
                                                                            css.left
                                                                        }
                                                                    >
                                                                        {
                                                                            display
                                                                        }
                                                                    </td>
                                                                    <td>{`${koChance *
                                                                        100}%`}</td>
                                                                    <td>{`${maxDamage} / ${hp}`}</td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                    </div>
                    <div className={cx(css.evSpreadColumn, css.fullHeight)}>
                        <p className={css.notes}>
                            Pokedex and moves from{' '}
                            <a
                                href="https://github.com/smogon/pokemon-showdown"
                                target="_blank"
                            >
                                Pokemon Showdown
                            </a>
                            , damage calculation from{' '}
                            <a
                                href="https://github.com/jake-white/VGC-Damage-Calculator"
                                target="_blank"
                            >
                                Trainer Tower's damage calculator
                            </a>
                        </p>
                        <label>
                            Your Pokemon
                            <button onClick={this.yourResetHandler}>
                                Reset
                            </button>
                        </label>
                        <textarea
                            className={css.yourInput}
                            onChange={this.yourInputHandler}
                            value={yourInput}
                        ></textarea>
                        {yourError && <div>{yourError}</div>}
                        <hr />
                        <label>
                            Opponents
                            <button onClick={this.opponentResetHandler}>
                                Reset
                            </button>
                        </label>
                        <textarea
                            className={css.opponentInput}
                            onChange={this.opponentInputHandler}
                            value={opponentInput}
                        ></textarea>
                        {opponentError && <div>{opponentError}</div>}
                    </div>
                </div>
            </div>
        );
    }
}
