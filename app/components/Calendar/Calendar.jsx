/* eslint-disable */
/*
 * THIS COMPONENT IS TEMPORARY FORKED FROM
 * https://bitbucket.org/atlassian/atlaskit/src/4e15b22cd39d/packages/calendar/?at=master
 * BECAUSE IT'S BROKEN IN VERSION 1.3
 */
import React, { PureComponent } from 'react';
import { CalendarStateless } from '@atlaskit/calendar';
import moment from 'moment';

type Props = {|
  /** Function to be called when a select action occurs, called with the an ISO
  string of the date, aka YYYY-MM-DD */
  onUpdate?: (event) => void;
|}

export default class Calendar extends PureComponent {
  props: Props // eslint-disable-line react/sort-comp

  static defaultProps: {
    onUpdate: () => {},
  }

  constructor(props) {
    super(props);
    const today = moment().date();
    const thisMonth = moment().month() + 1;
    const thisYear = moment().year();
    this.state = {
      day: today,
      focused: 0,
      selected: [],
      month: thisMonth,
      year: thisYear,
    };
  }

  handleBlur = () => this.setState({
    focused: 0,
  })

  handleChange = ({ day, month, year }) => {
    this.setState({
      focused: day,
      month,
      year,
    });
  }

  handleSelect = ({ iso, day, month, year }) => {
    const { selected } = this.state;
    this.handleChange({ day, month, year });
    if (selected.indexOf(iso) === -1) {
      this.setState({ selected: [iso], focused: day });
      console.log('CALENDAR onUpdate', iso, moment(iso).format('MM/DD/YYYY'));
      this.props.onUpdate(moment(iso).format('MM/DD/YYYY')); // FIXES https://bitbucket.org/atlassian/atlaskit/issues/64/calendar-onupdate-is-not-used
    } else {
      this.setState({ selected: [] });
    }
  }

  render() {
    return (
      <CalendarStateless
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        {...this.state}
      />
    );
  }
}
