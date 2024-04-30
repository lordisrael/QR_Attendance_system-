// eslint-disable-next-line no-undef
const { StatusCodes } = require("http-status-codes");
// eslint-disable-next-line no-undef
const CustomAPIError = require("./custom-api");

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.StatusCodes = StatusCodes.BAD_REQUEST;
  }
}

// eslint-disable-next-line no-undef
module.exports = BadRequestError;
