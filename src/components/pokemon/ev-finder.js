import React from 'react';

import pokemonTypes from './type-info.json';
import { getDamageFromStats } from './utils';
import PokemonCard from './pokemon-card';

import css from './styles.css';
import css2 from './types.css';

export default class PokemonEVFinder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div>
                <PokemonCard
                    pokemon={{
                        species: 'garchomp',
                        ivs: {
                            hp: 24,
                            atk: 12,
                            def: 30,
                            spa: 16,
                            spd: 23,
                            spe: 5,
                        },
                        evs: {
                            hp: 74,
                            atk: 190,
                            def: 91,
                            spa: 48,
                            spd: 84,
                            spe: 23,
                        },
                        nature: 'adamant',
                        item: 'flameorb',
                        ability: 'guts',
                        moves: [
                            'knock off',
                            'facade',
                            'close combat',
                            'protect',
                        ],
                        level: 50,
                    }}
                />
            </div>
        );
    }
}
