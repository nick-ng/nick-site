import React from 'react';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import { capFirst, withOrdinalSuffix } from '../../utils/string';
import css from './styles.css';

const SpellCard = props => {
    const {
        spell: {
            name,
            school,
            level,
            castingTime,
            range,
            components,
            materials,
            duration,
            durationConditions,
            description,
        },
    } = props;
    return (
        <div className={css.spellCard}>
            <h4>{name}</h4>
            {level === 0 ? (
                <p className={css.spellLevel}>{`${capFirst(school)} cantrip`}</p>
            ) : (
                <p className={css.spellLevel}>{`${withOrdinalSuffix(level)}-level ${school}`}</p>
            )}
            <div className={css.spellInfoGrid}>
                <div>Casting Time:</div>
                <div>{castingTime}</div>

                <div>Range:</div>
                <div>{range}</div>

                <div>Components:</div>
                <div>{components}</div>

                <div>Duration:</div>
                <div>{duration}</div>
            </div>
            <ReactMarkdown className={css.spellDescription}>{description}</ReactMarkdown>
        </div>
    );
};

export default SpellCard;
