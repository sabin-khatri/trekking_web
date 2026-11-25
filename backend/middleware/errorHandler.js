export function errorHandler(error, _req, res, _next) {
  console.error(error);
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: 'The provided data is invalid.' });
  }
  return res.status(500).json({ message: 'The server could not complete the request.' });
}
