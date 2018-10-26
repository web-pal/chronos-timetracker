import {
  actionTypes,
} from 'actions';


const clearListPlugin = (resourceType, opts) =>
  (state, action) => {
    if (action.type !== actionTypes.CLEAR_RESOURCES_LIST) {
      return state;
    }

    const { list } = action;
    const newState = {
      ...state,
      lists: {
        ...state.lists,
        [list]:
          (
            opts.initialState &&
            opts.initialState.lists &&
            opts.initialState.lists[list]
          ) ? opts.initialState.lists[list] : [],
      },
    };
    const indexedList = `${list}Indexed`;
    if (indexedList) {
      return {
        ...newState,
        lists: {
          ...newState.lists,
          [indexedList]:
            (
              opts.initialState &&
              opts.initialState.lists &&
              opts.initialState.lists[indexedList]
            ) ? opts.initialState.lists[indexedList] : {},
        },
      };
    }
    return newState;
  };


export default clearListPlugin;
