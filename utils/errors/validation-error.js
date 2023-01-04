const { VALIDATION_ERROR_CODE } = require('./errorConstans');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = VALIDATION_ERROR_CODE;
  }
}

module.exports = new ValidationError('Переданы некорректные данные.');
