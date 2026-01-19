import express from 'express';
import authController from '../controllers/auth.controller.js';
import passport from 'passport';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// TODO: Remove this debug route after fixing OAuth
router.get('/debug-config', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || "UNDEFINED";
  res.json({
    googleClientId: clientId,
    length: clientId.length,
    charCodes: clientId.split('').map(c => c.charCodeAt(0)),
    env: process.env.NODE_ENV
  });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/login?error=GoogleAuthFailed' }),
  authController.oauthCallback
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: 'http://localhost:3000/login?error=GitHubAuthFailed' }),
  authController.oauthCallback
);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.me);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/contact', authController.contact);
router.post('/change-password', protect, authController.changePassword);
router.delete('/account', protect, authController.deleteAccount);

export default router;
