import React, { PropTypes, Component } from 'react';
import storage from 'electron-json-storage';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as trackerActions from '../actions/tracker';

class Syncer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      needSync: false,
      count: 0,
      synced: 0,
      errors: 0,
      syncing: false,
    };
  }

  componentDidMount() {
    storage.get('offline_worklogs', (err, data) => {
      if (Array.isArray(data) && data.length) {
        this.setState({
          needSync: true,
          count: data.length,
          worklogs: data,
        })
      }
    })
  }

  sync = () => {
  }

  render() {
    const { needSync, count, syncing, synced } = this.state;
    return (
      <div className="Syncer section">
        {!needSync && !syncing &&
          <span className="fa fa-check" />
        }
        {needSync &&
          <div>
            <span className="fa fa-exclamation-triangle" />
            {count} worklog{count === 1 ? '' : 's'} not synced
            <a onClick={this.sync}>&nbsp;sync</a>
          </div>
        }
        {syncing &&
          <div>
            <span className="fa fa-spinner fa-spin" />
              syncing... {synced}/{count}
          </div>
        }
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...trackerActions }, dispatch);
}

export default connect(null, mapDispatchToProps)(Syncer);
