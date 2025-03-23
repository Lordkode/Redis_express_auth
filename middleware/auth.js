function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    res.status(401).json({ message: "Not authenticated" });
  }
}

module.exports = {requireAuth, isAuthenticated};
