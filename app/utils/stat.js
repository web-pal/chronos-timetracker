import mixpanel from 'mixpanel-browser';

export const trackMixpanel = (event, data) => {
  if (process.env.DISABLE_MIXPANEL !== '1' && !process.env.MIXPANEL_API_TOKEN) {
    mixpanel.track(event, data);
  }
};

export const incrementMixpanel = (event, data) => {
  if (process.env.DISABLE_MIXPANEL !== '1' && !process.env.MIXPANEL_API_TOKEN) {
    mixpanel.people.increment(event, data);
  }
};
