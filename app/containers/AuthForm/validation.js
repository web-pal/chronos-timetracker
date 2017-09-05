export const validate = (values) => {
  const errors = {};
  if (!values.get('host')) {
    errors.host = 'Requried';
  }
  if (!values.get('username')) {
    errors.username = 'Requried';
  }
  if (!values.get('password')) {
    errors.password = 'Requried';
  }
  return errors;
};

