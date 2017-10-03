import type { authFormData } from '../../types';

const validate = (values: authFormData) => {
  const errors = {};
  if (!values.host) {
    errors.host = 'Requried';
  }
  if (!values.username) {
    errors.username = 'Requried';
  }
  if (!values.password) {
    errors.password = 'Requried';
  }
  return errors;
};

export default validate;
