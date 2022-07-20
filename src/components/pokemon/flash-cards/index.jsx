import React from 'react';
import shuffle from 'lodash/shuffle';

import typeInfo from '../type-info.json';
import PokemonFlashCard from './card';
import PokemonFlashCardStats from './stats';

import css from './styles.css';

const POKEMON_FLASH_CARDS_HISTORY = 'POKEMON_FLASH_CARDS_HISTORY';
const { order } = typeInfo;
export default class PokemonFlashCards extends React.Component {
  state = {
    currentAttacker: null,
    currentDefender: null,
    history: [],
    quizHistory: [],
    quizDuration: 60,
    isQuizzing: false,
    timerUpdater: null,
    quizSecondsRemaining: 0,
    questionsAnswered: 0,
  };

  componentDidMount() {
    this.getNewMatchUp();
    this.setState({
      history: JSON.parse(
        localStorage.getItem(POKEMON_FLASH_CARDS_HISTORY) || '[]'
      ),
    });
  }

  componentWillUnmount() {
    this.resetTimerHandler();
  }

  quizDurationChangeHandler = (event) => {
    const seconds = Number(event.target.value);
    if (!isNaN(seconds)) {
      this.setState({
        quizDuration: seconds,
      });
    }
  };

  resetTimerHandler = () => {
    const { timerUpdater } = this.state;

    if (timerUpdater !== null) {
      clearInterval(timerUpdater);
    }

    this.setState({
      isQuizzing: false,
      timerUpdater: null,
      questionsAnswered: 0,
    });
  };

  startQuizHandler = () => {
    const { isQuizzing, quizDuration, quizSecondsRemaining } = this.state;
    if (isQuizzing) {
      if (quizSecondsRemaining > 0) {
        this.setState((prev) => ({
          questionsAnswered: prev.questionsAnswered + 1,
        }));
      }

      return;
    }

    this.setState({
      isQuizzing: true,
      timerUpdater: null,
      quizSecondsRemaining: quizDuration,
      questionsAnswered: 1,
    });
  };

  getNewMatchUp = (prevA = '', prevD = '') => {
    let newA = null;
    let newD = null;

    do {
      newA = shuffle(order)[0];
      newD = shuffle(order)[0];
    } while (newA === prevA && newD === prevD);

    this.setState({
      currentAttacker: newA,
      currentDefender: newD,
    });
  };

  answerHandler = (aType, dType, answer) => {
    this.startQuizHandler();
    let newHistory = [];
    this.setState(
      (prevState) => {
        const { history, quizHistory } = prevState;
        newHistory = [
          { aType, dType, answer, timestamp: Date.now() },
          ...history,
        ].slice(0, 10000);

        return {
          history: newHistory,
          quizHistory: [
            { aType, dType, answer, timestamp: Date.now() },
            ...quizHistory,
          ],
        };
      },
      () => {
        localStorage.setItem(
          POKEMON_FLASH_CARDS_HISTORY,
          JSON.stringify(newHistory)
        );
      }
    );

    this.getNewMatchUp(aType, dType);
  };

  renderQuizStatus = () => {
    const { quizSecondsRemaining, questionsAnswered } = this.state;

    if (quizSecondsRemaining > 0) {
      return <div>{`${quizSecondsRemaining}s left`}</div>;
    }

    return <div>{`Answered ${questionsAnswered} questions.`}</div>;
  };

  render() {
    const { currentAttacker, currentDefender, history } = this.state;

    return (
      <div className={css.pokemonFlashCards}>
        <h2>Pokemon Type Flash Cards</h2>
        <div>
          <PokemonFlashCard
            aType={currentAttacker}
            dType={currentDefender}
            answerHandler={this.answerHandler}
          />
        </div>
        <PokemonFlashCardStats
          history={history}
          showAnswers={true}
          resetStatsHandler={() => {
            localStorage.setItem(POKEMON_FLASH_CARDS_HISTORY, []);
            this.setState({
              history: [],
            });
          }}
        />
      </div>
    );
  }
}
