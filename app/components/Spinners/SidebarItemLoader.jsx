import React, { PropTypes } from 'react';

const randWidth = Math.random() * (20) + 50;

const SidebarItemLoader = ({ show }) => show &&
  <div className="SidebarItemLoaderWrap" style={{ width: `${randWidth}%` }}>
    <div className="SidebarItemLoader" />
  </div>;

SidebarItemLoader.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default SidebarItemLoader;
