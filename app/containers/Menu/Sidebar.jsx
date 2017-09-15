import React, { PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as uiActions from '../../actions/ui';

import SidebarItems from './SidebarItems';
import SidebarHeader from '../../components/Sidebar/SidebarHeader/SidebarHeader';
import Flex from '../../components/Base/Flex/Flex';
import SidebarFilter from './SidebarFilter';

import Filters from '../../components/Sidebar/Filters/Filters';

import ProjectPicker from './ProjectPicker';


const Sidebar = ({
  sidebarType,
  setSidebarType,
  currentProjectId,
  projectsFetched,
  showSidebarFilters,
}) => (
  <Flex column className="SidebarWrapper">
    <ProjectPicker />
    <SidebarHeader
      sidebarType={sidebarType}
      setSidebarType={setSidebarType}
    />
    <Flex column className="sidebar">
      <SidebarFilter />
      {showSidebarFilters &&
        <Filters />
      }
      {currentProjectId ?
        <SidebarItems /> :
        <span className="sidebar-nothing-selected">
          {projectsFetched && <span>Select project from dropdown above</span> }
        </span>
      }
    </Flex>
  </Flex>
);

Sidebar.propTypes = {
  setSidebarType: PropTypes.func.isRequired,
  showSidebarFilters: PropTypes.bool.isRequired,
  sidebarType: PropTypes.string.isRequired,
  currentProjectId: PropTypes.string,
  projectsFetched: PropTypes.bool.isRequired,
};

Sidebar.defaultProps = {
  currentProjectId: false,
};

function mapStateToProps({ projects, ui }) {
  return {
    currentProjectId: `${projects.meta.get('selectedProjectId')}`,
    projectsFetched: projects.meta.get('fetched'),
    sidebarType: ui.sidebarType,
    showSidebarFilters: ui.showSidebarFilters,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
