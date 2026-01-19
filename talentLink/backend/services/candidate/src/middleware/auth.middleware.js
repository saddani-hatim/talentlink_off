import { verifyToken } from '../utils/jwt.utils.js';

export const protect = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, token manquant' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    console.error('[AuthMiddleware] Error: Invalid or expired token');
    return res.status(401).json({ message: 'Non autorisé, token invalide ou expiré' });
  }

  console.log(`[AuthMiddleware] User authenticated: ${decoded.id} (${decoded.role})`);
  req.user = decoded;
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé, privilèges insuffisants' });
    }
    next();
  };
};
