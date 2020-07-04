import { BattlePokedex } from './showdown/pokedex';
import { BattleMovedex } from './showdown/moves';
import typeInfo from './type-info.json';

const { order, matchUps } = typeInfo;
export const statNames = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

// GameFreak rounds DOWN on .5
const pokeRound = num => (num % 1 > 0.5 ? Math.ceil(num) : Math.floor(num));
const product = array => array.reduce((p, c) => pokeRound(p * c), 1);
const lowerCaseNoSpace = s => s && s.replace(/\s/g, '').toLocaleLowerCase('en');
const strCompare = (str1, str2) =>
    lowerCaseNoSpace(str1) === lowerCaseNoSpace(str2);

export const getTotalEVs = evs =>
    statNames.reduce((p, name) => p + evs[name], 0);

export const getEffectiveness = (attackingType, defendingType) => {
    const att = attackingType.toLocaleLowerCase('en');
    const def = defendingType.toLocaleLowerCase('en');
    if (order.includes(att) && order.includes(def)) {
        return matchUps[att][def];
    }
    return -1;
};

export const get2Effectiveness = (attackingType, defendingTypes) => {
    return defendingTypes.reduce(
        (p, defendingType) =>
            p * getEffectiveness(attackingType, defendingType),
        1
    );
};

export const getMoveInfo = (move, dynamax) => {
    if (typeof move === 'string') {
        return BattleMovedex[lowerCaseNoSpace(move)];
    }
    if (move.name && !move.basePower) {
        return {
            ...move,
            ...BattleMovedex[lowerCaseNoSpace(move.name)],
        };
    }
    return {
        ...move,
        name: move.name || `${move.category} ${move.basePower} ${move.type}`,
    };
};

export const getDamageFromStats = (
    a,
    d,
    basePower,
    { level = 50, weather = 1, crit = 1, stab = 1, type = 1, modifiers = [] }
) => {
    return [
        0.85,
        0.86,
        0.87,
        0.88,
        0.89,
        0.9,
        0.91,
        0.92,
        0.93,
        0.94,
        0.95,
        0.96,
        0.97,
        0.98,
        0.99,
        1,
    ].map(r => {
        const baseDamage = Math.floor(
            Math.floor((Math.floor(2 * level * 0.2 + 2) * basePower * a) / d) /
                50 +
                2
        );

        let damage = product([baseDamage, weather, crit]);
        damage = Math.floor(damage * r);
        damage = pokeRound(damage * stab);
        damage = Math.floor(damage * type);

        return product([damage, ...modifiers]);
    });
};

export const getDamageFromObjects = ({
    attacker,
    defender,
    move,
    modifiers = [],
}) => {
    const {
        types: attackerTypes,
        finalStats: { atk, spa },
        level,
        dynamax,
    } = attacker;
    const {
        types: defenderTypes,
        finalStats: { def, spd },
        ability: defenderAbility,
    } = defender;
    const {
        basePower,
        category,
        flags,
        type: moveType,
        weather = 1,
        terrain = 1,
        crit = 1,
        target = 'normal',
    } = getMoveInfo(move, dynamax);

    if (target.toLocaleLowerCase('en').includes('all')) {
        modifiers.push(0.75);
    }

    let intimidate = 1;
    if (strCompare(defenderAbility, 'intimidate')) {
        intimidate = 2 / 3;
    }

    let a = spa;
    let d = spd;
    if (strCompare(category, 'physical')) {
        a = Math.floor(atk * intimidate);
        d = def;
    }

    return getDamageFromStats(a, d, basePower, {
        crit,
        level,
        stab: attackerTypes.includes(moveType) ? 1.5 : 1,
        type: get2Effectiveness(moveType, defenderTypes),
        weather,
        modifiers: modifiers.concat([terrain]),
    });
};

export const getFinalStat = (
    baseStat,
    iv,
    ev,
    nature = 1,
    isHP = false,
    level = 50
) => {
    const ev4 = Math.floor(ev / 4);
    const calc1 = Math.floor((2 * baseStat + iv + ev4) * level * 0.01);
    if (isHP) {
        return calc1 + level + 10;
    }
    return Math.floor((calc1 + 5) * nature);
};

const natures = {
    hardy: {},
    lonely: { atk: 1.1, def: 0.9 },
    brave: { atk: 1.1, spe: 0.9 },
    adamant: { atk: 1.1, spa: 0.9 },
    naughty: { atk: 1.1, spd: 0.9 },
    bold: { def: 1.1, atk: 0.9 },
    docile: {},
    relaxed: { def: 1.1, spe: 0.9 },
    impish: { def: 1.1, spa: 0.9 },
    lax: { def: 1.1, spd: 0.9 },
    timid: { spe: 1.1, atk: 0.9 },
    hasty: { spe: 1.1, def: 0.9 },
    jolly: { spe: 1.1, spa: 0.9 },
    naive: { spe: 1.1, spd: 0.9 },
    modest: { spa: 1.1, atk: 0.9 },
    mild: { spa: 1.1, def: 0.9 },
    quiet: { spa: 1.1, spe: 0.9 },
    bashful: {},
    rash: { spa: 1.1, spd: 0.9 },
    calm: { spd: 1.1, atk: 0.9 },
    gentle: { spd: 1.1, def: 0.9 },
    sassy: { spd: 1.1, spe: 0.9 },
    careful: { spd: 1.1, spa: 0.9 },
    quirky: {},
};

export const getNatureBoost = (natureName, statName) =>
    natures[natureName][statName] || 1;

export const getFinalStats = ({ species, ivs, evs, level = 50 }) => {
    const pokedexEntry = BattlePokedex[lowerCaseNoSpace(species)];
    const { baseStats } = pokedexEntry;
    const finalStats = statNames.reduce((p, statName) => {
        p[statName] = getFinalStat(
            baseStats[statName],
            ivs[statName],
            evs[statName],
            getNatureBoost(evs.nature, statName),
            strCompare(statName, 'hp'),
            level
        );
        return p;
    }, {});
    return finalStats;
};

export const hydratePokemon = pokemon => {
    const { species, ivs, evs, level = 50 } = pokemon;
    const pokedexEntry = BattlePokedex[lowerCaseNoSpace(species)];
    return {
        ...pokedexEntry,
        ...pokemon,
        species: pokedexEntry.species,
        finalStats: getFinalStats(pokemon),
    };
};

export const getModifiers = (pokemon, move) => {
    const { item } = pokemon;
    const moveInfo = getMoveInfo(move);
    const modifiers = [];
    if (strCompare(item, 'lifeorb')) {
        modifiers.push(5324 / 4096);
    }
    if (
        strCompare(item, 'choiceband') &&
        strCompare(moveInfo.category, 'physical')
    ) {
        modifiers.push(1.5);
    }
    if (
        strCompare(item, 'choicespecs') &&
        strCompare(moveInfo.category, 'special')
    ) {
        modifiers.push(1.5);
    }
    return modifiers;
};

export const getValidEVs = (level = 50) => {
    const validEVs = [];
    let counter = 0;
    do {
        if (level === 50) {
            validEVs.push(Math.max(8 * counter - 4, 0));
        } else {
            validEVs.push(4 * counter);
        }
        counter++;
    } while (validEVs[validEVs.length - 1] < 252);
    return validEVs;
};

export const getCalcQueue = (yourPokemon, opponents) => {
    const queue = [];
    const yourPokemonHydrated = hydratePokemon(yourPokemon);

    opponents.forEach(opponent => {
        opponent.evSpreads.forEach(evSpread => {
            const { name: evSpreadName, evs } = evSpread;
            opponent.items.forEach(item => {
                opponent.moves.forEach(move => {
                    const moveInfo = getMoveInfo(move);
                    const nature = evs.nature;
                    const hydratedOpponent = hydratePokemon({
                        species: opponent.species,
                        ivs: opponent.ivs,
                        evs,
                        nature: evs.nature,
                        item,
                        level: opponent.level,
                    });
                    const damageParams = {
                        display: `${
                            hydratedOpponent.species
                        } ${nature} ${evSpreadName} ${item} ${moveInfo.display ||
                            moveInfo.name} vs ${yourPokemonHydrated.display ||
                            yourPokemonHydrated.species}`,
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

    return queue;
};

export const processItem = item => {
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
        koChanceR: -koChance,
        maxDamage: damageRange[damageRange.length - 1],
        maxDamageR: -damageRange[damageRange.length - 1],
        hp,
    };
};

export const processQueue = queue => {
    return queue.map(processItem);
};

export const processQueue2 = (yourPokemon, opponents) => {
    const results = [];
    const yourPokemonHydrated = hydratePokemon(yourPokemon);
    opponents.forEach(opponent => {
        opponent.evSpreads.forEach(evSpread => {
            const { name: evSpreadName, evs } = evSpread;
            opponent.items.forEach(item => {
                const subResults = opponent.moves.map(move => {
                    const moveInfo = getMoveInfo(move);
                    const hydratedOpponent = hydratePokemon({
                        species: opponent.species,
                        ivs: opponent.ivs,
                        evs,
                        nature: evs.nature,
                        item,
                        level: opponent.level,
                    });
                    const damageParams = {
                        display: `${
                            hydratedOpponent.species
                        } ${evSpreadName} ${item} ${moveInfo.display ||
                            moveInfo.name}`,
                        attacker: hydratedOpponent,
                        defender: yourPokemonHydrated,
                        move,
                        weather: 1,
                        crit: 1,
                        modifiers: getModifiers(hydratedOpponent, move),
                    };
                    return processItem(damageParams);
                });
                let mostDamageResult = { maxDamage: 0 };
                subResults.forEach(subResult => {
                    if (subResult.maxDamage > mostDamageResult.maxDamage) {
                        mostDamageResult = subResult;
                    }
                });
                results.push(mostDamageResult);
            });
        });
    });
    return results;
};
