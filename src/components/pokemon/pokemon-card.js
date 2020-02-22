import React from 'react';

import pokemonTypes from './type-info.json';
import { BattlePokedex } from './showdown/pokedex';
import { getDamageFromStats, getFinalStat, getFinalStats } from './utils';

import css from './styles.css';
import css2 from './types.css';

const statNames = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];

const capitalizeFirstLetter = string =>
    string
        .toLocaleLowerCase('en')
        .charAt(0)
        .toLocaleUpperCase('en') + string.slice(1);

const evDisplay = evs =>
    statNames
        .map(
            statName =>
                evs[statName.toLocaleLowerCase('en')] > 0 &&
                `${statName} ${evs[statName.toLocaleLowerCase('en')]}`
        )
        .filter(a => a)
        .join(' / ');

const PokemonCard = props => {
    const { pokemon, showControls = false } = props;
    const {
        species,
        ivs,
        evs,
        nature,
        item,
        ability,
        moves,
        level = 50,
    } = pokemon;
    const dex = BattlePokedex[species.toLocaleLowerCase('en')];
    const finalStats = getFinalStats(pokemon);

    return (
        <div className={css.pokemonCard}>
            <div>{`${dex.species} @ ${item || 'No Item'}`}</div>
            <div>{`Ability: ${ability}`}</div>
            <div>{`Level: ${level}`}</div>
            <div>{`EVs: ${evDisplay(evs)}`}</div>
            <div>{`${capitalizeFirstLetter(nature)} Nature`}</div>
            {moves.map(move => (
                <div key={`${species}-${move}`}>{`- ${move}`}</div>
            ))}
        </div>
    );
};

export default PokemonCard;
