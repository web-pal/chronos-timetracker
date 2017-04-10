import { schema } from 'normalizr';
import { worklogSchema } from './worklog';

export const issueSchema = new schema.Entity('issues', {
  fields: {
    worklog: {
      worklogs: [worklogSchema],
    },
  },
});


export const issueStatusCategorySchema = new schema.Entity('issueStatusCategory');
