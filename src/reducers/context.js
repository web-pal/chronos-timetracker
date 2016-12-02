import * as types from '../constants/context';

const InitialState = Immutable.Record({
  projects: Immutable.List([]),
  currentProject: Immutable.Map({}),
  currentProjectId: null,
  issues: Immutable.List([]),
  currentIssue: Immutable.Map({}),
  currentIssueId: null,
  worklogs: Immutable.List([]),
  settings: Immutable.Map({}),
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
    case types.SET_CURRENT_ISSUE:
      return state
              .set('currentIssue', state.issues.get(action.issueId))
              .set('currentIssueId', action.issueId);
    case types.GET_SETTINGS:
      return state.set('settings', Immutable.fromJS(action.settings));
    default:
      return state;
  }
}
