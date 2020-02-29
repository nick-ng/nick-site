import React from 'react';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import { capFirst, withOrdinalSuffix } from '../../utils/string';
import css from './styles.css';

const printRange = range => {
    if (range === -1) {
        return 'Self';
    }
    if (range === 0) {
        return 'Touch';
    }
    return `${range} feet`;
};

const printComponents = (components, materials) => {
    return components
        .map(component => {
            if (component.toUpperCase() === 'M') {
                return `M (${materials})`;
            }
            return component.toUpperCase();
        })
        .join(', ');
};

const printDurationConditionsConditions = durationConditions =>
    durationConditions ? `${capFirst(durationConditions)}, ` : '';

const printDuration = duration => {
    if (duration === 0) {
        return 'Instantaneous';
    }
    if (duration < 10) {
        return `${duration} round${duration === 1 ? '' : 's'}`;
    }
    const minutes = duration / 10;
    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
    const hours = minutes / 60;
    if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'}`;
    }
    const days = hours / 24;
    return `${days} day${days === 1 ? '' : 's'}`;
};

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
                <div>{castingTime} action</div>

                <div>Range:</div>
                <div>{printRange(range)}</div>

                <div>Components:</div>
                <div>{printComponents(components, materials)}</div>

                <div>Duration:</div>
                <div>{`${printDurationConditionsConditions(durationConditions)}${printDuration(
                    duration
                )}`}</div>
            </div>
            <ReactMarkdown>{description}</ReactMarkdown>
        </div>
    );
};

export default SpellCard;
