import React from 'react';
import { NavLink as NavLinkRRD } from 'react-router-dom';

import objectWithoutProperties from '../../../src_common/utils/object-without-properties';

import css from './styles.css';

const INDENT_PX = 10;

const NavLink = (props) => {
    const {
        indentLevel = 0,
        emoji,
        children,
    } = props;
    const otherProps = objectWithoutProperties(props, [
        'indentLevel',
        'emoji',
        'children',
    ]);
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
        >
            <span className={css.navEmoji}>{emoji}</span>
            <span className={css.navText}>{children}</span>
        </NavLinkRRD>
    )
};

export default NavLink;
