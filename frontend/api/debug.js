module.exports = (req, res) => {
  res.json({ status: 'debug_ok', environment: process.env.NODE_ENV, message: 'Minimalist endpoint reached' });
};
