import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../../../../key/key_new'), 'utf8');
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../../../../key/key_new.pub'), 'utf8');

export const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      name: user.candidate ? `${user.candidate.firstName} ${user.candidate.lastName}` : (user.company ? user.company.name : user.email)
    },
    PRIVATE_KEY,
    { 
      algorithm: 'RS256', 
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' 
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    PRIVATE_KEY,
    { 
      algorithm: 'RS256', 
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' 
    }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
  } catch (error) {
    return null;
  }
};
