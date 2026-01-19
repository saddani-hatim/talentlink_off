import authService from '../services/auth.service.js';

class AuthController {
  async signup(req, res) {
    try {
      const user = await authService.signup(req.body);
      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: { id: user.id, email: user.email, role: user.role }
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async oauthCallback(req, res) {
    try {
        if (!req.user) {
            return res.redirect('http://localhost:3000/login?error=AuthenticationFailed');
        }
        
        const { accessToken, refreshToken } = await authService.generateTokens(req.user);

        // Store tokens in cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        // Determine redirect URL based on role
        const redirectUrl = req.user.role === 'COMPANY' ? '/for-companies' : '/for-candidates';
        
        // Redirect to frontend
        res.redirect(`http://localhost:3000${redirectUrl}`);
    } catch (error) {
        console.error("OAuth Callback Error:", error);
        res.redirect('http://localhost:3000/login?error=ServerCallbackError');
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.login(email, password);

      // Stocker l'access token dans un cookie HttpOnly
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      // Stocker le refresh token dans un cookie HttpOnly (plus sécurisé que le stockage DB seul)
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
      });

      res.json({
        message: 'Connexion réussie',
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          name: user.candidateprofile ? `${user.candidateprofile.firstName} ${user.candidateprofile.lastName}` : (user.companyprofile ? user.companyprofile.name : user.email)
        }
      });
    } catch (error) {
      console.error('ERREUR LOGIN:', error);
      res.status(401).json({ message: error.message });
    }
  }

  async refresh(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(401).json({ message: 'Refresh token manquant' });

      const { accessToken } = await authService.refresh(refreshToken);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
      });

      res.json({ message: 'Token rafraîchi' });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async logout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async me(req, res) {
    // req.user est injecté par le middleware d'auth
    res.json({ user: req.user });
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);
      res.json({ message: 'Si un compte existe pour cet e-mail, un lien de réinitialisation a été envoyé.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      await authService.resetPassword(token, password);
      res.json({ message: 'Votre mot de passe a été réinitialisé avec succès.' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async contact(req, res) {
    try {
      await authService.contact(req.body);
      res.json({ message: 'Votre message a été envoyé avec succès.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      await authService.changePassword(req.user.id, oldPassword, newPassword);
      res.json({ message: 'Mot de passe modifié avec succès' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteAccount(req, res) {
    try {
      await authService.deleteAccount(req.user.id);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.json({ message: 'Compte supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AuthController();
