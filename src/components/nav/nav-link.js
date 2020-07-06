import React from 'react';
import { NavLink as NavLinkRRD } from 'react-router-dom';

import cx from 'classnames';

import objectWithoutProperties from '../../../src_common/utils/object-without-properties';

import css from './styles.css';

const INDENT_PX = 10;

const hasAdminKey = () => Boolean(localStorage.getItem('adminKey'));

const NavLink = props => {
    const { indentLevel = 0, icons, children } = props;

    const otherProps = objectWithoutProperties(props, [
        'indentLevel',
        'icon',
        'children',
    ]);

    const style = indentLevel
        ? {
              marginLeft: `${indentLevel * INDENT_PX}px`,
              marginTop: '-4px',
          }
        : {};

    const iconsArray = typeof icons === 'string' ? [icons] : icons;

    return (
        <NavLinkRRD
            className={css.navLink}
            activeClassName={css.activeNavLink}
            {...otherProps}
            style={style}
        >
            {iconsArray.map(
                (icon, i) =>
                    icon && (
                        <i
                            className={cx(css.navIcon, 'fa', icon)}
                            key={`${icon}-${i}`}
                        />
                    )
            )}
            <span className={css.navText}>{children}</span>
        </NavLinkRRD>
    );
};

export const AdminNav = props => (hasAdminKey() ? NavLink(props) : null);

export default NavLink;
