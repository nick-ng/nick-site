import React from 'react';
import axios from 'axios';
import cx from 'classnames';

import { capFirst, withOrdinalSuffix } from '../../utils/string';
import css from './styles.css';

import SpellCard from './spell-card';

export default class SpellBook extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spellInfo: {},
            isSpellInfoLoading: false,
            isSpellInfo2Loading: false,
            spellList: {},
            isSpellListLoading: false,
            chosenSpellLevel: null,
            chosenSpellId: null,
        };
    }

    async componentDidMount() {
        this.fetchSpellInfo();
        this.fetchSpellInfo2();
        this.fetchSpellList();
    }

    componentDidUpdate(prevProps) {
        const { casterClass } = this.props;
        if (casterClass !== prevProps.casterClass) {
            this.fetchSpellList(casterClass);
        }
    }

    fetchSpellInfo() {
        this.setState(
            {
                isSpellInfoLoading: true,
            },
            async () => {
                const res = await axios.get('/dnd-spells.json');
                this.setState(prevState => {
                    const { spellInfo } = prevState;
                    return {
                        spellInfo: {
                            ...spellInfo,
                            ...res.data,
                        },
                        isSpellInfoLoading: false,
                    };
                });
            }
        );
    }

    fetchSpellInfo2() {
        this.setState(
            {
                isSpellInfo2Loading: true,
            },
            async () => {
                const res = await axios.get('/dnd-spells-2.json');
                this.setState(prevState => {
                    const { spellInfo } = prevState;
                    return {
                        spellInfo: {
                            ...spellInfo,
                            ...res.data,
                        },
                        isSpellInfo2Loading: false,
                    };
                });
            }
        );
    }

    fetchSpellList() {
        const { casterClass } = this.props;
        if (casterClass) {
            this.setState(
                {
                    isSpellListLoading: true,
                },
                async () => {
                    const res = await axios.get(
                        `/dnd-${casterClass}-spell-list.json`
                    );
                    this.setState({
                        spellList: res.data,
                        isSpellListLoading: false,
                    });
                }
            );
        }
    }

    getCurrentSpellList() {
        const { chosenSpellLevel, spellList } = this.state;
        if (chosenSpellLevel) {
            return spellList[chosenSpellLevel].sort();
        }
        return Object.values(spellList)
            .reduce((p, spellSublist) => p.concat(spellSublist), [])
            .sort();
    }

    spellLevelHandler(spellLevel) {
        this.setState(prevState => {
            if (prevState.chosenSpellLevel === spellLevel) {
                return {
                    chosenSpellLevel: null,
                };
            }
            return {
                chosenSpellLevel: spellLevel,
            };
        });
    }

    spellHandler(spellId) {
        this.setState({
            chosenSpellId: spellId,
        });
    }

    render() {
        const { casterClass } = this.props;
        const {
            spellInfo,
            spellList,
            chosenSpellLevel,
            chosenSpellId,
            isSpellInfoLoading,
            isSpellInfo2Loading,
            isSpellListLoading,
        } = this.state;

        return (
            <div>
                <h2>{capFirst(casterClass)} Spell Book</h2>
                {isSpellInfoLoading ||
                isSpellListLoading ||
                isSpellInfo2Loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className={css.spellBook}>
                        <div className={css.spellLevels}>
                            {Object.keys(spellList).map(level => (
                                <button
                                    key={`${casterClass}-level-${level}`}
                                    className={cx(
                                        chosenSpellLevel === level &&
                                            css.selected
                                    )}
                                    onClick={() =>
                                        this.spellLevelHandler(level)
                                    }
                                >
                                    {level === '0'
                                        ? 'Cantrips'
                                        : `${withOrdinalSuffix(level)}-level`}
                                </button>
                            ))}
                        </div>
                        <div className={css.spellNames}>
                            {this.getCurrentSpellList().map(spellId => (
                                <button
                                    key={`${casterClass}-${spellId}}`}
                                    className={cx(
                                        chosenSpellId === spellId &&
                                            css.selected
                                    )}
                                    onClick={() => this.spellHandler(spellId)}
                                >
                                    {spellInfo[spellId]
                                        ? spellInfo[spellId].name
                                        : spellId}
                                </button>
                            ))}
                        </div>
                        <div>
                            {spellInfo[chosenSpellId] ? (
                                <SpellCard
                                    key={`${casterClass}-${chosenSpellId}-card`}
                                    spell={spellInfo[chosenSpellId]}
                                />
                            ) : (
                                <h3>Choose a spell.</h3>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
