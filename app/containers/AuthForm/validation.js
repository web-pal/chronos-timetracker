const validate = (values) => {
  const errors = {};
  if (!values.host) {
    errors.host = 'Requried';
  }
  return errors;
};

export default validate;
