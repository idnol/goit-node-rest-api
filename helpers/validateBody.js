const HttpError = require("./HttpError.js");

const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

module.exports = validateBody;
