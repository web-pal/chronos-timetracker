import { schema } from 'normalizr';
import { worklogSchema } from './worklog';

export const issueSchema = new schema.Entity('issues', {
  fields: {
    worklog: {
      worklogs: [worklogSchema],
    },
  },
});


export const issueTypeSchema = new schema.Entity('issueTypes');


export const issueStatusCategorySchema = new schema.Entity('issueStatusCategory');

export const issueStatusSchema = new schema.Entity('issueStatus', {
  statusCategory: issueStatusCategorySchema,
});
