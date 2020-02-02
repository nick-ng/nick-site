import React from 'react';

import css from './styles.css';
import css2 from '../types.css';

const FlashCard = ({ aType, dType, answer, answerHandler }) => {
    return (
        <div className={css.cardContainer}>
            <div className={css.question}>
                <table>
                    <thead>
                        <tr>
                            <th>Attacker</th>
                            <th>Defender</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={css2[aType]}>{aType}</td>
                            <td className={css2[dType]}>{dType}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={css.answer}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <button>1</button>
                            </td>
                            <td>
                                <button>2</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button>0.5</button>
                            </td>
                            <td>
                                <button>0</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FlashCard;
