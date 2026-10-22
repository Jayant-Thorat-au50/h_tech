export const errorHandler = (err, _req, res, _next) => {
  if (err.name === 'ZodError') {
    return res.status(400).json({
      message: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      errors: err.errors,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      message: `A record with that ${field} already exists.`,
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
};
