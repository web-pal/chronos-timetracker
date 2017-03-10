import { schema } from 'normalizr';
import { worklogSchema } from './worklog';

const issueTypeSchema = new schema.Entity('issueTypes');
const prioritySchema = new schema.Entity('priorities');
const statusSchema = new schema.Entity('statuses');
const resolutionSchema = new schema.Entity('resolutions');

export const issueSchema = new schema.Entity('issues', {
  fields: {
    worklog: {
      worklogs: [worklogSchema],
    },
  },
});
