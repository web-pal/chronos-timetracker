import {
  setResourceMeta,
} from 'redux-resource';
import {
  actionTypes,
} from 'actions';


const metaPlugin = () =>
  (state, action) => {
    if (action.type !== actionTypes.SET_RESOURCES_META) {
      return state;
    }

    if (action.resources) {
      return {
        ...state,
        meta: setResourceMeta({
          resources: action.resources,
          meta: state.meta,
          newMeta: action.meta,
        }),
      };
    }
    return {
      ...state,
      meta: {
        ...state.meta,
        ...action.meta,
      },
    };
  };


export default metaPlugin;
