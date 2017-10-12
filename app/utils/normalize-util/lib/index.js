import { normalize, schema } from 'normalizr';

const Schemas = {
  projects: new schema.Array(new schema.Entity('projects', {})),
  sprints: new schema.Array(new schema.Entity('sprints', {})),
  boards: new schema.Array(new schema.Entity('boards', {})),
  issues: new schema.Array(new schema.Entity('issues', {})),
  issueTypes: new schema.Array(new schema.Entity('issueTypes', {})),
  issueStatuses: new schema.Array(new schema.Entity('issueStatuses', {})),
};

export default function normalizedPayload(entities, entityName) {
  if (!Schemas[entityName]) {
    const errorMsg = `No normalization schema found for entityName=${entityName},
 you likely mistyped entityName (${entityName}) or forgot to add Schema for ${entityName}`;
    throw new Error(errorMsg);
  }
  if (!entities || typeof entities !== 'object') {
    const errorMsg = `Cannot normalize ${entities}. You likely passed bad entities
 object for ${entityName} entityName. Expected ${typeof {}}, got ${typeof entities}`;
    throw new TypeError(errorMsg);
  }
  const normalizedEntities = normalize(entities, Schemas[entityName]);
  return {
    ids: normalizedEntities.result.map(i => String(i)) || [],
    map: normalizedEntities.entities[entityName] || {},
  };
}
