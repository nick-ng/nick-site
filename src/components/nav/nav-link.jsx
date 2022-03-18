import React from 'react';
import { NavLink as NavLinkRRD } from 'react-router-dom';

import cx from 'classnames';

import css from './styles.css';

const INDENT_PX = 10;

const hasAKey = (otherKeys) => {
  if (otherKeys) {
    otherKeys.some((key) => Boolean(localStorage.getItem(key)));
  }
  return Boolean(localStorage.getItem('adminKey'));
};

const NavLink = (props) => {
  const { indentLevel = 0, icons, children, ...otherProps } = props;

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
            <i className={cx(css.navIcon, 'fa', icon)} key={`${icon}-${i}`} />
          )
      )}
      <span className={css.navText}>{children}</span>
    </NavLinkRRD>
  );
};

export const AdminNav = ({ otherKeys, ...otherProps }) => {
  return hasAKey(otherKeys) ? <NavLink {...otherProps} /> : null;
};

export default NavLink;
