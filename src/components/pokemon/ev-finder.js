import React from 'react';

import pokemonTypes from './type-info.json';
import { getDamageFromStats, hydratePokemon } from './utils';
import PokemonCard from './pokemon-card';

import css from './styles.css';
import css2 from './types.css';

const exampleOpponents = [
    {
        species: 'excadrill',
        ivs: {
            hp: 31,
            atk: 31,
            def: 31,
            spa: 0,
            spd: 31,
            spe: 31,
        },
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
            {
                name: '4 SpD',
                evs: {
                    hp: 0,
                    atk: 252,
                    def: 0,
                    spa: 0,
                    spd: 4,
                    spe: 252,
                },
            },
            {
                name: '4 Def',
                evs: {
                    hp: 0,
                    atk: 252,
                    def: 4,
                    spa: 0,
                    spd: 0,
                    spe: 252,
                },
            },
        ],
        natures: ['jolly', 'adamant'],
        items: ['focussash', 'lifeorb'],
        moves: ['ironhead', 'rockslide', 'highhorsepower', 'earthquake'],
        level: 50,
    },
];

const yourPokemon = {
    species: 'Togekiss',
    ivs: {
        hp: 31,
        atk: 0,
        def: 31,
        spa: 31,
        spd: 31,
        spe: 31,
    },
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

export default class PokemonEVFinder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            yourPokemon,
            opponents: exampleOpponents,
            queue: [],
            results: [],
        };

        this.updateQueue = this.updateQueue.bind(this);
        this.processQueue = this.processQueue.bind(this);
    }

    componentDidMount() {
        this.updateQueue();
    }

    updateQueue() {
        const { yourPokemon, opponents } = this.state;
        const queue = [];
        const yourPokemonHydrated = hydratePokemon(yourPokemon);
        opponents.forEach(opponent => {
            opponent.natures.forEach(nature => {
                opponent.evSpreads.forEach(evSpread => {
                    const { name: evSpreadName, evs } = evSpread;
                    opponent.items.forEach(item => {
                        opponent.moves.forEach(move => {
                            const hydratedOpponent = hydratePokemon({
                                species: opponent.species,
                                ivs: opponent.ivs,
                                evs,
                                nature,
                                level: opponent.level,
                            });
                            const damageParams = {
                                display: `${hydratedOpponent.species}-${nature}-${evSpreadName}-${item}-${move} vs ${yourPokemonHydrated.species}`,
                                attacker: hydratedOpponent,
                                defender: yourPokemonHydrated,
                                move,
                                weather: 1,
                                crit: 1,
                                modifiers: [],
                            };
                            queue.push(damageParams);
                        });
                    });
                });
            });
        });
        this.setState({
            queue,
        });
    }

    async processQueue() {
        const { queue } = this.state;

        const a = await Promise.all(
            queue.map(item => {
                const {
                    defender: {
                        finalStats: { hp },
                    },
                } = item;
                console.log('hp', hp);
                return hp;
            })
        );
        console.log('a', a);
    }

    render() {
        const { queue } = this.state;
        return (
            <div>
                <h2>Pokemon EV Spread Finder</h2>
                <PokemonCard
                    pokemon={yourPokemon}
                />
                <div>{queue.length}</div>
                <button onClick={this.processQueue}>Click!</button>
                <div style={{ whiteSpace: 'pre' }}>
                    {JSON.stringify(queue, null, '  ')}
                </div>
            </div>
        );
    }
}
