// @flow
import apiFactory from './trelloApi';
import enhancedFetch from './enhancedFetch';


export const trelloApi = apiFactory({
  makeRequest: enhancedFetch,
});
