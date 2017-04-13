import { schema } from 'normalizr';

export const projectSchema = new schema.Entity('projects');

export const boardSchema = new schema.Entity('boards');

export const sprintsSchema = new schema.Entity('sprints');
