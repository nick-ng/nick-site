import { BattleMovedex } from './showdown/moves';
import typeInfo from './type-info';

const { order, types } = typeInfo;

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
        modifiers: [],
    });
};
