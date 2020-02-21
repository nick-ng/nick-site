import React from 'react';

import pokemonTypes from '../type-info.json';
import FlashCard from './flash-card';

import css from './styles.css';
import css2 from '../types.css';

export default class PokemonFlashCards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { order, types } = pokemonTypes;
        return (
            <div>
                {order.map(type => {
                    return (
                        <FlashCard
                            key={`card-${type}`}
                            aType={type}
                            dType={type}
                        />
                    );
                })}
            </div>
        );
    }
}
