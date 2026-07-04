const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized. Please sign in.' });
  }
  next();
};

const requireHR = (req, res, next) => {
  if (req.session.role !== 'HR') {
    return res.status(403).json({ message: 'Access denied. HR privileges required.' });
  }
  next();
};

module.exports = {
  requireAuth,
  requireHR
};
