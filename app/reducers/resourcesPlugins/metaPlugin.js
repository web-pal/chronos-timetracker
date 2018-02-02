import {
  actionTypes,
} from 'actions';


const metaPlugin = () =>
  (state, action) => {
    if (action.type !== actionTypes.SET_RESOURCES_META) {
      return state;
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
