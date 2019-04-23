import mixpanel from 'mixpanel-browser';

import {
  version,
} from '../../package.json';

export const trackMixpanel = (event, data = {}) => {
  if (process.env.DISABLE_MIXPANEL !== '1' && process.env.MIXPANEL_API_TOKEN) {
    try {
      mixpanel.track(
        event,
        {
          ...data,
          version,
        },
      );
    } catch (err) {
      console.error(err);
    }
  }
};

export const incrementMixpanel = (event, data) => {
  if (process.env.DISABLE_MIXPANEL !== '1' && process.env.MIXPANEL_API_TOKEN) {
    try {
      mixpanel.people.increment(event, data);
    } catch (err) {
      console.error(err);
    }
  }
};
