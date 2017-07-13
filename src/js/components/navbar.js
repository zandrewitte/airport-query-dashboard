import React, { PropTypes } from 'react';

const NavBar = (props) => (
  <nav className="navbar">
    <span className="menu-items">
      <span className={`query ${props.selectedNav === 'query'? 'selected' : ''}`} value="query" onClick={() => props.changeNav(`query`)} />
      <span className={`reports ${props.selectedNav === 'reports'? 'selected' : ''}`} onClick={() => props.changeNav(`reports`)} />
    </span>

  </nav>
);

export default NavBar;
