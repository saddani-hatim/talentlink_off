import bcrypt from 'bcryptjs';
import pkg from '@prisma/client';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils.js';
import crypto from 'crypto';
import emailService from './email.service.js';

const { PrismaClient } = pkg;

class AuthService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async signup(data) {
    const { email, password, role, firstName, lastName, companyName } = data;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('Email déjà utilisé');

    const hashedPassword = await bcrypt.hash(password, 12);

    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role || 'CANDIDATE',
          updatedAt: new Date()
        }
      });

      if (role === 'COMPANY') {
        await tx.companyprofile.create({
          data: {
            userId: user.id,
            name: companyName || 'Entreprise'
          }
        });
      } else {
        await tx.candidateprofile.create({
          data: {
            userId: user.id,
            firstName: firstName || '',
            lastName: lastName || ''
          }
        });
      }

      return user;
    });
  }

  async login(email, password) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        candidateprofile: true,
        companyprofile: true
      }
    });

    if (!user) throw new Error('Identifiants invalides');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Identifiants invalides');

    return this.generateTokens(user);
  }

  async generateTokens(user) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Stocker le refresh token en base
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 jours par défaut

    await this.prisma.refreshtoken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt
      }
    });

    return { user, accessToken, refreshToken };
  }

  async refresh(refreshToken) {
    const dbToken = await this.prisma.refreshtoken.findFirst({
      where: { token: refreshToken },
      include: { user: { include: { candidateprofile: true, companyprofile: true } } }
    });

    if (!dbToken || dbToken.revoked || dbToken.expiresAt < new Date()) {
      throw new Error('Refresh token invalide ou expiré');
    }

    const accessToken = generateAccessToken(dbToken.user);
    return { accessToken };
  }

  async logout(refreshToken) {
    const tokenRecord = await this.prisma.refreshtoken.findFirst({
      where: { token: refreshToken }
    });
    if (tokenRecord) {
      await this.prisma.refreshtoken.update({
        where: { id: tokenRecord.id },
        data: { revoked: true }
      });
    }
  }

  async forgotPassword(email) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Pour des raisons de sécurité, on ne dit pas si l'email existe ou non
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 heure

    await this.prisma.passwordresettoken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    await emailService.sendPasswordResetEmail(email, token);
  }

  async resetPassword(token, newPassword) {
    const resetToken = await this.prisma.passwordresettoken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new Error('Le lien de réinitialisation est invalide ou a expiré');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword }
    });

    // Supprimer le token utilisé
    await this.prisma.passwordresettoken.delete({
      where: { id: resetToken.id }
    });
  }

  async contact(data) {
    const { name, email, subject, message } = data;
    await emailService.sendContactEmail(name, email, subject, message);
  }
  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Utilisateur non trouvé');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error('Ancien mot de passe incorrect');

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }

  async deleteAccount(userId) {
    // Prisma cascading delete should handle related profiles if configured, 
    // but we can be explicit here if needed. Assuming relations have onDelete: Cascade 
    // in schema.prisma for simplicity.
    await this.prisma.user.delete({
      where: { id: userId }
    });
  }
}

export default new AuthService();
