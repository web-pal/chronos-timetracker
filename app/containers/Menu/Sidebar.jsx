import React, { PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as uiActions from '../../actions/ui';

import SidebarItems from './SidebarItems';
import SidebarHeader from '../../components/Sidebar/SidebarHeader/SidebarHeader';
import Flex from '../../components/Base/Flex/Flex';
import SidebarFilter from './SidebarFilter';

const Sidebar = ({ sidebarType, setSidebarType, currentProjectId }) =>
  <Flex column className="SidebarWrapper">
    <SidebarHeader
      sidebarType={sidebarType}
      setSidebarType={setSidebarType}
    />
    <Flex column className="sidebar">
      <SidebarFilter />
      {currentProjectId ?
        <SidebarItems /> :
        <span className="sidebar-nothing-selected">
          select project from dropdown above
        </span>
      }
    </Flex>
  </Flex>;

Sidebar.propTypes = {
  setSidebarType: PropTypes.func.isRequired,
  sidebarType: PropTypes.string.isRequired,
  currentProjectId: PropTypes.string,
};

Sidebar.defaultProps = {
  currentProjectId: false,
};

function mapStateToProps({ projects, ui }) {
  return {
    currentProjectId: projects.meta.get('selected'),
    sidebarType: ui.sidebarType,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
