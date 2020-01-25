import React from 'react';
import { NavLink as NavLinkRRD } from 'react-router-dom';

import objectWithoutProperties from '../../../src_common/utils/object-without-properties';

import css from './styles.css';

const INDENT_PX = 10;

const NavLink = (props) => {
    const { indentLevel = 0 } = props;
    const otherProps = objectWithoutProperties(props, ['indentLevel']);
    const style = indentLevel ? {
        marginLeft: `${indentLevel * INDENT_PX}px`,
        marginTop: '-4px',
    } : {}
    return (
        <NavLinkRRD
            className={css.navLink}
            activeClassName={css.activeNavLink}
            {...otherProps}
            style={style}
        />
    )
};

export default NavLink;
