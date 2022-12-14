const validationCode = 201;
const validationErrorCode = 400;
const notFoundErrorCode = 404;
const defaultErrorCode = 500;
const handleDefaultError = (err, res) => {
  res.status(defaultErrorCode).send({ message: 'Произошла ошибка сервера!' });
};

module.exports = {
  validationCode,
  validationErrorCode,
  notFoundErrorCode,
  defaultErrorCode,
  handleDefaultError,
};
