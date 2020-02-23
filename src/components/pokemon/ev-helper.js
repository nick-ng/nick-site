import React from 'react';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
import chunk from 'lodash/chunk';
import cx from 'classnames';

import {
    getDamageFromObjects,
    getModifiers,
    getMoveInfo,
    getCalcQueue,
    processQueue,
    hydratePokemon,
} from './utils';
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

const EXAMPLE_OPPONENTS = [
    {
        species: 'excadrill',
        ivs,
        evSpreads: [
            {
                name: '4 HP',
                evs: {
                    hp: 4,
                    atk: 252,
                    def: 0,
                    spa: 0,
                    spd: 0,
                    spe: 252,
                },
            },
        ],
        natures: ['jolly', 'adamant'],
        items: ['focussash', 'lifeorb', 'choiceband'],
        moves: [
            'ironhead',
            'rockslide',
            'highhorsepower',
            'earthquake',
            {
                name: 'Max Steelspike',
                basePower: 130,
                type: 'steel',
                category: 'physical',
            },
        ],
        level: 50,
    },
    {
        species: 'barraskewda',
        ivs,
        evSpreads: [
            {
                name: '4 HP',
                evs: {
                    hp: 4,
                    atk: 252,
                    def: 0,
                    spa: 0,
                    spd: 0,
                    spe: 252,
                },
            },
        ],
        natures: ['jolly', 'adamant'],
        items: ['lifeorb', 'choiceband'],
        moves: [
            'Liquidation',
            'Close Combat',
            'Crunch',
            'Poison Jab',
            {
                name: 'Liquidation',
                display: 'Liquidation (Rain)',
                weather: 1.5,
            },
        ],
        level: 50,
    },
];

const YOUR_EXAMPLE_POKEMON = {
    species: 'Togekiss',
    ivs,
    evs: {
        hp: 236,
        atk: 0,
        def: 196,
        spa: 12,
        spd: 12,
        spe: 52,
    },
    nature: 'bold',
    item: 'scopelens',
    ability: 'superluck',
    moves: ['dazzlinggleam', 'airslash', 'heatwave', 'protect'],
    level: 50,
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
        let fewestOHKOs = Infinity;
        const goodResults = [];
        const evChunks = chunk(
            defensiveEVSpreads50,
            Math.max(5, 1000 / queue.length)
        );
        await [evChunks[0]].reduce(
            (p, chunk, i) =>
                p.then(
                    () =>
                        new Promise(resolve => {
                            this.setState({
                                progress: `Progress: ${(
                                    (i / evChunks.length) *
                                    100
                                ).toFixed(1)}%`,
                            });
                            for (const data of chunk) {
                                const { evs, total } = data;
                                // 10 Make your pokemon with this ev spread
                                const tempPokemon = Object.assign(
                                    {},
                                    yourPokemon,
                                    {
                                        display: `${yourPokemon.species} ${yourPokemon.nature} ${evs.hp}/x/${evs.def}/x/${evs.spd}/x`,
                                        evs,
                                    }
                                );
                                const tempQueue = getCalcQueue(
                                    tempPokemon,
                                    opponents
                                );
                                // 20 Get results for that pokemon against opponents
                                const calculations = processQueue(tempQueue);
                                // 30 Filter out un-interesting results
                                // 40 Push good results into goodResults
                                goodResults.push({
                                    evSpreadName: `${yourPokemon.nature} ${evs.hp}/x/${evs.def}/x/${evs.spd}/x`,
                                    calculations,
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
                this.updateQueue
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
                this.updateQueue
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
        } = this.state;
        return (
            <div>
                <h2>Pokemon EV Helper</h2>
                <div className={css.evSpreadContainer}>
                    <div className={css.evSpreadColumn}>
                        <PokemonCard pokemon={yourPokemon} />
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
                        {progress && <div>{progress}</div>}
                        {results.length > 0 &&
                            results.map(result => (
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
                                            {reverse(
                                                sortBy(
                                                    result.calculations.filter(
                                                        a => a.maxDamage > 0
                                                    ),
                                                    ['koChance', 'maxDamage']
                                                )
                                            )
                                                .slice(
                                                    0,
                                                    processedBruteForce ? 5 : -1
                                                )
                                                .map(
                                                    ({
                                                        display,
                                                        koChance,
                                                        maxDamage,
                                                        hp,
                                                    }) => {
                                                        return (
                                                            <tr key={display}>
                                                                <td
                                                                    className={
                                                                        css.left
                                                                    }
                                                                >
                                                                    {display}
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
