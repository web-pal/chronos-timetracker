import {
  actionTypes,
} from 'actions';


function generateDefaultInitialState() {
  return {
    // These is a complete collection of all of the resources that the server has sent
    // back, for all requests. The keys of this Object are the resource's ID. There's
    // no ordering here: use `lists` for that.
    resources: {},
    // This is metadata about _specific_ resources. For instance, if a DELETE
    // is in flight for a book with ID 24, then you could find that here.
    meta: {},
    // Named requests are used to track the statuses of requests that aren't
    // associated with a resource ID
    requests: {},
    // Lists are ordered collections of resources
    lists: {},
  };
}

const clearAllPlugin = (resourceType, opts) =>
  (state, action) => {
    if (action.type !== actionTypes.__CLEAR_ALL_REDUCERS__) {
      return state;
    }

    const defaultInitialState = generateDefaultInitialState();
    const initialState = opts.initialState || {};
    return {
      ...defaultInitialState,
      ...initialState,
    };
  };

export default clearAllPlugin;
