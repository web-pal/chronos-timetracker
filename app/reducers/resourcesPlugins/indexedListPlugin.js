import {
  actionTypes,
} from 'redux-resource';


const indexedListPlugin = () =>
  (state, action) => {
    if (action.type !== actionTypes.READ_RESOURCES_SUCCEEDED) {
      return state;
    }

    const {
      list,
      indexedList = false,
      startIndex = 0,
    } = action;

    if (!indexedList) {
      return state;
    }
    const indexedListName = `${list}Indexed`;
    const prevIndexed = state.lists[indexedListName] || {};
    return {
      ...state,
      lists: {
        ...state.lists,
        [indexedListName]: {
          ...prevIndexed,
          ...action.resources.reduce((acc, resource, index) => {
            acc[startIndex + index] = resource.id;
            return acc;
          }, {}),
        },
      },
    };
  };


export default indexedListPlugin;
