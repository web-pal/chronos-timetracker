import * as types from '../constants/context';

const InitialState = Immutable.Record({
  projects: Immutable.List([]),
  currentProject: Immutable.Map({}),
  currentProjectId: null,
  issues: Immutable.List([]),
  recentIssues: Immutable.List([]),
  currentIssue: Immutable.Map({}),
  currentIssueId: null,
  worklogs: Immutable.List([]),
  settings: Immutable.Map({}),
  filterValue: '',
  resolveFilter: true,
  fetching: null,
});

const initialState = new InitialState();

export default function context(state = initialState, action) {
  switch (action.type) {
    case types.GET_PROJECTS:
      return state.set('projects', Immutable.fromJS(action.projects));
    case types.SET_CURRENT_PROJECT:
      return state
              .set('currentProject', state.projects.get(action.projectId))
              .set('currentProjectId', action.projectId);
    case types.GET_ISSUES:
      return state.set('issues', Immutable.fromJS(action.issues));
    case types.GET_RECENT_ISSUES:
      return state.set('recentIssues', Immutable.fromJS(action.payload).toList());
    case types.SET_CURRENT_ISSUE:
      return state
              .set('currentIssue', state.issues.find(issue => issue.get('id') === action.issueId))
              .set('currentIssueId', action.issueId);
    case types.GET_SETTINGS:
      return state.set('settings', Immutable.fromJS(action.settings));
    case types.CHANGE_FILTER:
      return state.set('filterValue', action.value);
    case types.CLEAR_FILTER:
      return state.delete('filterValue');
    case types.TOGGLE_RESOLVE_FILTER:
      return state.set('resolveFilter', !state.get('resolveFilter'));
    case types.START_FETCH:
      return state.set('fetching', action.value);
    case types.FINISH_FETCH:
      return state.delete('fetching');
    default:
      return state;
  }
}
