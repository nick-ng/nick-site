import React from 'react';
import { Link } from 'react-router';
import css from './styles.css';

export default function NavLink(props) {
  return (
    <div>
      <Link
        {...props}
        className={css.normalLink}
        activeClassName={css.activeLink}
      />
    </div>
  );
}
