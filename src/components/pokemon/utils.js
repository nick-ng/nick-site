import { BattlePokedex } from './showdown/pokedex';
import { BattleMovedex } from './showdown/moves';
import typeInfo from './type-info';

const { order, types } = typeInfo;
export const statNames = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

// GameFreak rounds DOWN on .5
const pokeRound = num => (num % 1 > 0.5 ? Math.ceil(num) : Math.floor(num));
const product = array => array.reduce((p, c) => pokeRound(p * c), 1);

export const getEffectiveness = (attackingType, defendingType) => {
    const att = attackingType.toLocaleLowerCase('en');
    const def = defendingType.toLocaleLowerCase('en');
    if (order.includes(att) && order.includes(def)) {
        return types[att][def];
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

export const getDamageFromObjects = (
    attacker,
    defender,
    move,
    { level = 50, weather = 1, crit = 1, modifiers = [] }
) => {
    const {
        types: attackerTypes,
        finalStats: { atk, spa },
    } = attacker;
    const {
        types: defenderTypes,
        finalStats: { def, spd },
    } = defender;
    const { basePower, category, flags, type: moveType } = move;

    let a = spa;
    let d = spd;
    if (category.toLocaleLowerCase('en') === 'physical') {
        a = atk;
        d = def;
    }

    return getDamageFromStats(a, d, basePower, {
        crit,
        level,
        stab: attackerTypes.includes(moveType) ? 1.5 : 1,
        type: get2Effectiveness(moveType, defenderTypes),
        weather,
        modifiers,
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

export const getFinalStats = ({ species, ivs, evs, nature, level }) => {
    const pokemon = BattlePokedex[species.toLocaleLowerCase('en')];
    const { baseStats } = pokemon;
    const finalStats = statNames.reduce((p, statName) => {
        p[statName] = getFinalStat(
            baseStats[statName],
            ivs[statName],
            evs[statName],
            getNatureBoost(nature, statName),
            statName === 'hp',
            level
        );
        return p;
    }, {});
    return finalStats;
};
