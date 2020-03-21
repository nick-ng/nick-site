import React from 'react';
import cx from 'classnames';

import { order, matchUps } from '../type-info.json';

import css from './styles.css';
import css2 from '../types.css';

const evaluateAnswer = (aType, dType, answer) => {
    if (!order.includes(aType) || !order.includes(dType)) {
        return `${aType} vs ${dType}`;
    }

    if (matchUps[aType][dType] === answer) {
        return 'correct';
    } else {
        return 'wrong';
    }
};

const PokemonFlashCard = ({ aType, dType, answer, answerHandler }) => {
    const evaluation = evaluateAnswer(aType, dType, answer);
    return (
        <div className={css.cardContainer}>
            <div className={css.question}>
                <div className={css.role}>Attacker</div>
                <div className={cx(css.type, css2[aType])}>{aType}</div>
                <div className={css.role}>Defender</div>
                <div className={cx(css.type, css2[dType])}>{dType}</div>
            </div>
            {typeof answer === 'number' ? (
                <div className={cx(css.answer, css[evaluation])}>{`${evaluation}!`}</div>
            ) : (
                <div className={css.answerSelector}>
                    <button onClick={() => answerHandler(aType, dType, 0)}>0</button>
                    <button onClick={() => answerHandler(aType, dType, 0.5)}>½</button>
                    <button onClick={() => answerHandler(aType, dType, 1)}>1</button>
                    <button onClick={() => answerHandler(aType, dType, 2)}>2</button>
                </div>
            )}
        </div>
    );
};

export default PokemonFlashCard;
