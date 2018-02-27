import {
  actionTypes,
} from 'redux-resource';


const indexedListPlugin = () =>
  (state, action) => {
    const suiteAction = [
      actionTypes.READ_RESOURCES_SUCCEEDED,
      actionTypes.READ_RESOURCES_PENDING,
    ].includes(action.type);
    if (!suiteAction) {
      return state;
    }

    const {
      list,
      indexedList = false,
      startIndex = 0,
      stopIndex = 10,
    } = action;

    if (!indexedList) {
      return state;
    }

    const indexedListName = `${list}Indexed`;
    const prevIndexed = state.lists[indexedListName] || {};
    if (action.type === actionTypes.READ_RESOURCES_SUCCEEDED) {
      return {
        ...state,
        lists: {
          ...state.lists,
          [indexedListName]: {
            ...prevIndexed,
            ...action.resources.reduce((acc, resource, index) => {
              acc[startIndex + index] = resource.id || resource;
              return acc;
            }, {}),
          },
        },
      };
    }
    return {
      ...state,
      lists: {
        ...state.lists,
        [indexedListName]: {
          ...prevIndexed,
          ...Array.from(Array(stopIndex - startIndex).keys()).reduce((acc, resource, index) => {
            acc[startIndex + index] = 'pending';
            return acc;
          }, {}),
        },
      },
    };
  };


export default indexedListPlugin;
