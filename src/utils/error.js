const badRequestException = (msg = "Your request contains invalid data") => {
  const error = new Error(msg);
  error.status = 400;
  error.error = "Bad Request";
  return error;
};

const unauthorizedException = (
  msg = "Sorry, you are not authorized to access this resource."
) => {
  const error = new Error(msg);
  error.status = 401;
  error.error = "Unauthorized";
  return error;
};

const forbiddenException = (msg = "You don't have the right permissions") => {
  const error = new Error(msg);
  error.status = 403;
  error.error = "Forbidden";
  return error;
};
const notFoundException = (msg = "Requested resource not found") => {
  const error = new Error(msg);
  error.status = 404;
  error.error = "Not Found";
  return error;
};
const serverErrorException = (
  msg = "We are sorry for the inconvenience. Please try again later"
) => {
  const error = new Error(msg);
  error.status = 500;
  error.error = "Internal Server Error";
  return error;
};

module.exports = {
  badRequestException,
  unauthorizedException,
  forbiddenException,
  notFoundException,
  serverErrorException,
};
