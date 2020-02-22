import React from 'react';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
import cx from 'classnames';

import {
    getDamageFromObjects,
    getModifiers,
    getMoveInfo,
    hydratePokemon,
} from './utils';
import PokemonCard from './pokemon-card';

import css from './styles.css';

const YOUR_LOCAL_STORAGE_KEY = 'ev_finder_your_pokemon';
const OPPONENT_LOCAL_STORAGE_KEY = 'ev_finder_opponent_pokemon';

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
            queue: [],
            results: [],
        };

        this.updateQueue = this.updateQueue.bind(this);
        this.processQueue = this.processQueue.bind(this);
        this.yourInputHandler = this.yourInputHandler.bind(this);
        this.opponentInputHandler = this.opponentInputHandler.bind(this);
        this.yourResetHandler = this.yourResetHandler.bind(this);
        this.opponentResetHandler = this.opponentResetHandler.bind(this);
    }

    componentDidMount() {
        this.updateQueue();
    }

    updateQueue(callback = () => {}) {
        const { yourPokemon, opponents } = this.state;
        const queue = [];
        const yourPokemonHydrated = hydratePokemon(yourPokemon);
        opponents.forEach(opponent => {
            opponent.natures.forEach(nature => {
                opponent.evSpreads.forEach(evSpread => {
                    const { name: evSpreadName, evs } = evSpread;
                    opponent.items.forEach(item => {
                        opponent.moves.forEach(move => {
                            const moveInfo = getMoveInfo(move);
                            const hydratedOpponent = hydratePokemon({
                                species: opponent.species,
                                ivs: opponent.ivs,
                                evs,
                                nature,
                                item,
                                level: opponent.level,
                            });
                            const damageParams = {
                                display: `${
                                    hydratedOpponent.species
                                } ${nature} ${evSpreadName} ${item} ${moveInfo.display ||
                                    moveInfo.name} vs ${
                                    yourPokemonHydrated.species
                                }`,
                                attacker: hydratedOpponent,
                                defender: yourPokemonHydrated,
                                move,
                                weather: 1,
                                crit: 1,
                                modifiers: getModifiers(hydratedOpponent, move),
                            };
                            queue.push(damageParams);
                        });
                    });
                });
            });
        });
        this.setState(
            {
                processed: false,
                queue,
            },
            callback
        );
    }

    async processQueue() {
        const { queue } = this.state;

        const results = await Promise.all(
            queue.map(item => {
                const {
                    display,
                    move,
                    defender: {
                        finalStats: { hp },
                    },
                } = item;
                const damageRange = getDamageFromObjects(item);
                let kos = 0;
                damageRange.forEach(damage => {
                    if (damage >= hp) {
                        kos = kos + 1;
                    }
                });
                const koChance = kos / damageRange.length;
                return {
                    display,
                    move,
                    koChance,
                    maxDamage: damageRange[damageRange.length - 1],
                    hp,
                };
            })
        );
        this.setState({
            processed: true,
            results,
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
            queue,
            results,
            yourPokemon,
            yourInput,
            yourError,
            opponentInput,
            opponentError,
        } = this.state;
        return (
            <div>
                <h2>Pokemon EV Helper</h2>
                <div className={css.evSpreadContainer}>
                    <div className={css.evSpreadColumn}>
                        <PokemonCard pokemon={yourPokemon} />
                        {!processed && (
                            <button
                                onClick={this.processQueue}
                            >{`Process ${queue.length}`}</button>
                        )}
                        {results.length > 0 && (
                            <table className={css.damageResult}>
                                <thead>
                                    <tr>
                                        <th className={css.left}>Calc</th>
                                        <th>OHKO %</th>
                                        <th>Max Damage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reverse(
                                        sortBy(
                                            results.filter(
                                                a => a.maxDamage > 0
                                            ),
                                            ['koChance', 'maxDamage']
                                        )
                                    ).map(
                                        ({
                                            display,
                                            koChance,
                                            maxDamage,
                                            hp,
                                        }) => {
                                            return (
                                                <tr key={display}>
                                                    <td className={css.left}>
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
                        )}
                    </div>
                    <div className={cx(css.evSpreadColumn, css.fullHeight)}>
                        <label>
                            Your Pokemon{' '}
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
                            Opponents{' '}
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
