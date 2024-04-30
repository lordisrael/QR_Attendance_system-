class CustomAPIError extends Error {
  constructor(message) {
    super(message);
  }
}

// eslint-disable-next-line no-undef
module.exports = CustomAPIError;
