import React from 'react';
import shuffle from 'lodash/shuffle';

import { order as allTypes, matchUps } from '../type-info.json';
import Card from './card';

import css from './styles.css';

const POKEMON_FLASH_CARDS_HISTORY = 'POKEMON_FLASH_CARDS_HISTORY';

export default class PokemonFlashCards extends React.Component {
    state = {
        currentAttacker: null,
        currentDefender: null,
        history: [],
    };

    componentDidMount() {
        this.getNewMatchUp();
        this.setState({
            history: JSON.parse(localStorage.getItem(POKEMON_FLASH_CARDS_HISTORY) || '[]'),
        });
    }

    getNewMatchUp = (prevA = '', prevD = '') => {
        let newA = null;
        let newD = null;

        do {
            newA = shuffle(allTypes)[0];
            newD = shuffle(allTypes)[0];
        } while (newA === prevA && newD === prevD);

        this.setState({
            currentAttacker: newA,
            currentDefender: newD,
        });
    };

    answerHandler = (aType, dType, answer) => {
        let newHistory = [];
        this.setState(
            prevState => {
                const { history } = prevState;
                newHistory = [...history, { aType, dType, answer, timestamp: Date.now() }];

                return {
                    history: newHistory,
                };
            },
            () => {
                localStorage.setItem(POKEMON_FLASH_CARDS_HISTORY, JSON.stringify(newHistory));
            }
        );

        this.getNewMatchUp(aType, dType);
    };

    render() {
        const { currentAttacker, currentDefender, history } = this.state;
        return (
            <div className={css.pokemonFlashCards}>
                <h2>Pokemon Type Flash Cards</h2>
                <div>
                    <Card
                        aType={currentAttacker}
                        dType={currentDefender}
                        answerHandler={this.answerHandler}
                    />
                </div>
                <div className={css.answerHistory}>
                    {history
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .slice(0, 3)
                        .map(({ aType, dType, answer, timestamp }) => (
                            <Card key={timestamp} aType={aType} dType={dType} answer={answer} />
                        ))}
                </div>
                <div>Stats</div>
            </div>
        );
    }
}
